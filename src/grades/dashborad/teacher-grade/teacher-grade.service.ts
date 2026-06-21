import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Grade, GradeDocument } from '../../schemas/grade.schema';
import { Enrollment, EnrollmentDocument } from '../../../enrollment/schemas/enrollment.schema';
import { Course, CourseDocument } from '../../../courses/schemas/course.schema';
import { TeacherAddGradeDto } from '../../dto/teacher-add-grade.dto';
import { TeacherUpdateGradeDto } from '../../dto/teacher-update-grade.dto';

@Injectable()
export class TeacherGradeService {
  constructor(
    @InjectModel('Grades') private readonly gradeModel: Model<GradeDocument>,
    @InjectModel('Enrollment') private readonly enrollmentModel: Model<EnrollmentDocument>,
    @InjectModel('Course') private readonly courseModel: Model<CourseDocument>,
  ) {}

  private async assertOwnsCourse(teacherId: string, courseId: string) {
    const course = await this.courseModel.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');
    if (String(course.teacher_id) !== String(teacherId)) {
      throw new ForbiddenException('You do not teach this course');
    }
    return course;
  }

  async addGrade(teacherId: string, courseId: string, enrollmentId: string, dto: TeacherAddGradeDto) {
    await this.assertOwnsCourse(teacherId, courseId);

    const enrollment = await this.enrollmentModel.findById(enrollmentId);
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    if (String(enrollment.course_id) !== String(courseId)) {
      throw new BadRequestException('Enrollment does not belong to this course');
    }
    if (enrollment.status !== 'ACCEPTED') {
      throw new BadRequestException('Only accepted enrollments can be graded');
    }

    const existing = await this.gradeModel.findOne({ enrollment_id: enrollmentId });
    if (existing) {
      throw new ConflictException('This enrollment already has a grade — use update instead');
    }

    return this.gradeModel.create({
      enrollment_id: enrollmentId,
      grade_value: dto.grade_value,
      result: dto.result,
      notes: dto.notes,
    });
  }

  async getGradesForCourse(teacherId: string, courseId: string) {
  await this.assertOwnsCourse(teacherId, courseId);

  const enrollments = await this.enrollmentModel.find({
    $or: [
      { course_id: courseId },
      { course_id: new Types.ObjectId(courseId) },
    ],
  }).select('_id');
  const enrollmentIds = enrollments.map((e) => e._id);

  return this.gradeModel
    .find({ enrollment_id: { $in: enrollmentIds } })
    .populate({
      path: 'enrollment_id',
      populate: { path: 'student_id', select: 'full_name email' },
    });
}

  async updateGrade(teacherId: string, gradeId: string, dto: TeacherUpdateGradeDto) {
    const grade = await this.gradeModel.findById(gradeId);
    if (!grade) throw new NotFoundException('Grade not found');

    const enrollment = await this.enrollmentModel.findById(grade.enrollment_id);
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    await this.assertOwnsCourse(teacherId, enrollment.course_id.toString());

    if (dto.grade_value !== undefined) grade.grade_value = dto.grade_value;
    if (dto.result !== undefined) grade.result = dto.result;
    if (dto.notes !== undefined) grade.notes = dto.notes;

    return grade.save();
  }
}