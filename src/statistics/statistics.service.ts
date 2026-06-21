import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from 'categories/schemas/category.schema';
import { Course, CourseDocument } from 'courses/schemas/course.schema';
import {
  Enrollment,
  EnrollmentDocument,
} from 'enrollment/schemas/enrollment.schema';
import { User, UserDocument } from 'users/schemas/user.schema';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<EnrollmentDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async getTeacherStatistics(): Promise<any> {
    const result = await this.courseModel.aggregate([
      {
        $group: {
          _id: '$teacher_id',
          courses_count: { $sum: 1 },
          course_ids: { $push: '$_id' },
        },
      },
      {
        $lookup: {
          from: 'enrollments',
          let: { courseIds: '$course_ids' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: [{ $toObjectId: '$course_id' }, '$$courseIds'] },
                    { $eq: ['$status', 'ACCEPTED'] },
                  ],
                },
              },
            },
            { $count: 'students_count' },
          ],
          as: 'students',
        },
      },
      {
        $addFields: {
          students_count: {
            $ifNull: [{ $arrayElemAt: ['$students.students_count', 0] }, 0],
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { teacherId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$_id', { $toObjectId: '$$teacherId' }] },
              },
            },
          ],
          as: 'teacher',
        },
      },
      { $unwind: { path: '$teacher', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          teacher_id: { $toString: '$_id' },
          teacher_name: { $ifNull: ['$teacher.full_name', 'Unknown Teacher'] },
          courses_count: 1,
          students_count: 1,
        },
      },
      { $sort: { teacher_name: 1 } },
    ]);

    return result;
  }

  async getEnrollmentStatistics(from?: string, to?: string) {
    const filter = this.buildDateRangeFilter(from, to);

    const stats = await this.enrollmentModel.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'courses',
          localField: 'course_id',
          foreignField: '_id',
          as: 'course',
        },
      },
      { $unwind: { path: '$course', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          display_status: {
            $switch: {
              branches: [
                {
                  case: { $eq: ['$status', 'PENDING_PAYMENT'] },
                  then: 'pending',
                },
                {
                  case: { $eq: ['$status', 'REJECTED'] },
                  then: 'cancelled',
                },
                {
                  case: {
                    $and: [
                      { $eq: ['$status', 'ACCEPTED'] },
                      { $eq: ['$course.status', 'completed'] },
                    ],
                  },
                  then: 'completed',
                },
                {
                  case: {
                    $and: [
                      { $eq: ['$status', 'ACCEPTED'] },
                      {
                        $not: {
                          $in: ['$course.status', ['completed', 'cancelled']],
                        },
                      },
                    ],
                  },
                  then: 'active',
                },
              ],
              default: 'other',
            },
          },
        },
      },
      {
        $group: {
          _id: '$display_status',
          count: { $sum: 1 },
        },
      },
    ]);

    const output = [
      { status: 'active', count: 0 },
      { status: 'completed', count: 0 },
      { status: 'cancelled', count: 0 },
      { status: 'pending', count: 0 },
    ];

    for (const item of stats) {
      if (item._id === 'other') {
        continue;
      }
      const existing = output.find((row) => row.status === item._id);
      if (existing) {
        existing.count = item.count;
      }
    }

    const total = output.reduce((sum, row) => sum + row.count, 0);
    return { data: output, total };
  }

  async getCourseStatistics(from?: string, to?: string) {
    const filter = this.buildDateRangeFilter(from, to);

    const byStatus = await this.courseModel.aggregate([
      { $match: filter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
        },
      },
    ]);

    const byCategory = await this.courseModel.aggregate([
      { $match: filter },
      { $group: { _id: '$category_id', count: { $sum: 1 } } },
      { $addFields: { categoryObjectId: { $toObjectId: '$_id' } } },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryObjectId',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          category: '$category.name',
          count: 1,
        },
      },
    ]);
    const total = await this.courseModel.countDocuments(filter);

    return {
      data: {
        by_status: byStatus,
        by_category: byCategory,
      },
      total,
    };
  }

  async getSummaryStatistics() {
    const [
      totalUsers,
      totalTeachers,
      totalStudents,
      totalCourses,
      totalEnrollments,
    ] = await Promise.all([
      this.userModel.countDocuments(),
      this.userModel.countDocuments({ role: 'teacher' }),
      this.userModel.countDocuments({ role: 'student' }),
      this.courseModel.countDocuments(),
      this.enrollmentModel.countDocuments(),
    ]);

    const cashPayments = await this.enrollmentModel.aggregate([
      { $match: { status: 'ACCEPTED' } },
      {
        $lookup: {
          from: 'courses',
          localField: 'course_id',
          foreignField: '_id',
          as: 'course',
        },
      },
      { $unwind: '$course' },
      {
        $group: {
          _id: null,
          total_cash_payments: { $sum: '$course.price' },
        },
      },
    ]);

    return {
      total_users: totalUsers,
      total_teachers: totalTeachers,
      total_students: totalStudents,
      total_courses: totalCourses,
      total_enrollments: totalEnrollments,
      total_cash_payments: cashPayments?.[0]?.total_cash_payments ?? 0,
    };
  }

  private buildDateRangeFilter(from?: string, to?: string) {
    const filter: Record<string, any> = {};
    const createdAt: Record<string, any> = {};

    if (from) {
      const fromDate = new Date(from);
      if (Number.isNaN(fromDate.getTime())) {
        throw new BadRequestException('Invalid from date');
      }
      fromDate.setHours(0, 0, 0, 0);
      createdAt.$gte = fromDate;
    }

    if (to) {
      const toDate = new Date(to);
      if (Number.isNaN(toDate.getTime())) {
        throw new BadRequestException('Invalid to date');
      }
      toDate.setHours(23, 59, 59, 999);
      createdAt.$lte = toDate;
    }

    if (Object.keys(createdAt).length > 0) {
      filter.createdAt = createdAt;
    }

    return filter;
  }

  async getCoursePerformanceStatistics() {
    return this.courseModel.aggregate([
      {
        $lookup: {
          from: 'enrollments',
          localField: '_id',
          foreignField: 'course_id',
          as: 'enrollments',
        },
      },
      {
        $lookup: {
          from: 'grades',
          let: { enrollmentIds: '$enrollments._id' },
          pipeline: [
            {
              $match: { $expr: { $in: ['$enrollment_id', '$$enrollmentIds'] } },
            },
          ],
          as: 'grades',
        },
      },
      {
        $project: {
          title: 1,
          total: { $size: '$enrollments' },
          accepted: {
            $size: {
              $filter: {
                input: '$enrollments',
                cond: { $eq: ['$$this.status', 'ACCEPTED'] },
              },
            },
          },
          graded: { $size: '$grades' },
          passed: {
            $size: {
              $filter: {
                input: '$grades',
                cond: { $eq: ['$$this.result', 'PASSED'] },
              },
            },
          },
          failed: {
            $size: {
              $filter: {
                input: '$grades',
                cond: { $eq: ['$$this.result', 'FAILED'] },
              },
            },
          },
        },
      },
    ]);
  }
}
