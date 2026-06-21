import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeacherAddGradeDto } from '../../dto/teacher-add-grade.dto';
import { TeacherUpdateGradeDto } from '../../dto/teacher-update-grade.dto';
import { Grades, GradeDocument } from '../../schemas/grade.schema';
import {
  Enrollment,
  EnrollmentDocument,
} from '../../../enrollment/schemas/enrollment.schema';
import { Course, CourseDocument } from '../../../courses/schemas/course.schema';

@Injectable()
export class TeacherGradeService {
  constructor(
    @InjectModel(Grades.name)
    private readonly gradeModel: Model<GradeDocument>,
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<EnrollmentDocument>,
    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
  ) {}

  async addGrade(
    teacherId: string,
    courseId: string,
    enrollmentId: string,
    dto: TeacherAddGradeDto,
  ) {
    if (!dto?.status) {
      throw new BadRequestException('status is required');
    }
    if (dto.status === 'rejected' && !dto.rejected_reason) {
      throw new BadRequestException(
        'rejected_reason is required when status=rejected',
      );
    }

    const course = await this.courseModel.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    if (String(course.teacher_id) !== String(teacherId)) {
      throw new BadRequestException('You are not the owner of this course');
    }

    const enrollment = await this.enrollmentModel.findById(enrollmentId);
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    if (String(enrollment.course_id) !== String(courseId)) {
      throw new BadRequestException(
        'Enrollment does not belong to this course',
      );
    }

    const existing = await this.gradeModel.findOne({
      student_id: enrollment.student_id,
      course_id: Number(courseId),
    });

    if (existing) {
      return existing;
    }

    const now = new Date();
    const gradePayload: Pick<
      Grades,
      | 'student_id'
      | 'course_id'
      | 'status'
      | 'requested_date'
      | 'accepted_date'
      | 'rejected_reason'
    > = {
      student_id: enrollment.student_id,
      course_id: Number(courseId),
      status: dto.status,
      requested_date: now,
      accepted_date: now,
      rejected_reason:
        dto.status === 'rejected' ? (dto.rejected_reason ?? 'N/A') : 'N/A',
    };

    const created = new this.gradeModel(gradePayload);
    return created.save();
  }

  async getGradesForCourse(teacherId: string, courseId: string) {
    const course = await this.courseModel.findById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    if (String(course.teacher_id) !== String(teacherId)) {
      throw new BadRequestException('You are not the owner of this course');
    }

    const grades = await this.gradeModel.find({ course_id: Number(courseId) });
    return grades;
  }

  async updateGrade(
    teacherId: string,
    gradeId: string,
    dto: TeacherUpdateGradeDto,
  ) {
    if (!dto?.status) {
      throw new BadRequestException('status is required');
    }
    if (dto.status === 'rejected' && !dto.rejected_reason) {
      throw new BadRequestException(
        'rejected_reason is required when status=rejected',
      );
    }

    const grade = await this.gradeModel.findById(gradeId);
    if (!grade) throw new NotFoundException('Grade not found');

    const course = await this.courseModel.findById(grade.course_id);
    if (!course) throw new NotFoundException('Course not found');

    if (String(course.teacher_id) !== String(teacherId)) {
      throw new BadRequestException('You are not the owner of this course');
    }

    grade.status = dto.status;
    grade.rejected_reason =
      dto.status === 'rejected' ? (dto.rejected_reason ?? 'N/A') : 'N/A';
    grade.accepted_date = new Date();

    return grade.save();
  }
}
