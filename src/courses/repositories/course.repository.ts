import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCourseDto } from 'courses/dto/create-course.dto';
import { QueryCourseDto } from 'courses/dto/query-course.dto';
import {
  Course,
  CourseDocument,
  CourseStatus,
} from 'courses/schemas/course.schema';
import {
  Enrollment,
  EnrollmentDocument,
} from 'enrollment/schemas/enrollment.schema';
import { Model } from 'mongoose';

@Injectable()
export class CoursesRepository {
  private handleError(error: any) {
    throw new InternalServerErrorException(error.message);
  }
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<EnrollmentDocument>,
  ) {}

  async getAllCourses() {
  try {
    return await this.courseModel.find().populate('category_id').populate('teacher_id', 'full_name email');
  } catch (error) {
    this.handleError(error);
  }
}

  async findCourseById(id: string) {
    try {
      return await this.courseModel.findById(id).populate('category_id').populate('teacher_id', 'full_name email');
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAvailableCourses(query: QueryCourseDto) {
    const filter: any = {};
    filter.status = query.status ? query.status : CourseStatus.AVAILABLE;

    if (query.categoryId) {
      filter.category_id = query.categoryId;
    }

    if (query.search) {
      filter.title = { $regex: query.search, $options: 'i' };
    }

    const courses = await this.courseModel.find(filter).populate('category_id').populate('teacher_id', 'full_name email');
    if (courses.length === 0) return courses;

    const courseIds = courses.map((c) => c._id);

    // One query: accepted enrollment count per course, for every course in this result set
    const counts = await this.enrollmentModel.aggregate([
      { $match: { course_id: { $in: courseIds }, status: 'ACCEPTED' } }, // swap for your EnrollmentStatus.ACCEPTED if you have that enum
      { $group: { _id: '$course_id', count: { $sum: 1 } } },
    ]);

    const countMap = new Map(counts.map((c) => [c._id.toString(), c.count]));

    return courses.map((course) => {
      const acceptedCount = countMap.get(course._id.toString()) ?? 0;
      return {
        ...course.toObject(),
        seats_remaining: Math.max(course.capacity - acceptedCount, 0),
      };
    });
  }

  async addCourse(course: CreateCourseDto) {
    try {
      const newCourse = new this.courseModel(course);
      return await newCourse.save();
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateCourse(id: string, course: Partial<CreateCourseDto>) {
    try {
      return await this.courseModel.findByIdAndUpdate(id, course, {
        new: true,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteCourse(id: string) {
    try {
      return await this.courseModel.findByIdAndDelete(id);
    } catch (error) {
      this.handleError(error);
    }
  }
  async updateCourseStatus(id: string, status: CourseStatus) {
    try {
      return await this.courseModel.findByIdAndUpdate(
        id,
        { status },
        { new: true },
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async getSeatsRemaining(courseId: string, capacity: number) {
    const acceptedCount = await this.enrollmentModel.countDocuments({
      course_id: courseId,
      status: 'ACCEPTED',
    });
    return Math.max(capacity - acceptedCount, 0);
  }

  async findCoursesByTeacher(teacherId: string, status?: string) {
  const filter: any = { teacher_id: teacherId };
  if (status && status !== 'all') {
    filter.status = status;
    console.log('Filtering courses for teacher', teacherId, 'with status', status, 'Filter:', filter);
  }
  try {
    return await this.courseModel.find(filter);
  } catch (error) {
    this.handleError(error);
  }
}
}
