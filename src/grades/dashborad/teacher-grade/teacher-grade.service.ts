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

    // Added validation: ensure grade_value is present if accepted
    if (dto.status === 'accepted' && !dto.grade_value) {
      throw new BadRequestException(
        'grade_value is required when status=accepted',
      );
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
      course_id: courseId,
    } as any);

    if (existing) {
      return existing;
    }

    const now = new Date();

    // FIX 1: Removed the restrictive `Pick<>` type.
    // FIX 2: Added fallback to 'N/A' for grade_value to satisfy the `required: true` schema rule if rejected.
    const gradePayload = {
      student_id: enrollment.student_id,
      course_id: courseId,
      status: dto.status,
      requested_date: now,
      accepted_date: now,
      grade_value: dto.grade_value || 'N/A',
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

    const grades = await this.gradeModel.find({ course_id: courseId });
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

    if (dto.status === 'accepted' && !dto.grade_value) {
      throw new BadRequestException(
        'grade_value is required when status=accepted',
      );
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

    // FIX 3: Actually apply the grade_value update from the DTO
    if (dto.grade_value) {
      grade.grade_value = dto.grade_value;
    } else if (dto.status === 'rejected') {
      grade.grade_value = 'N/A'; // Clear out grade if rejected
    }

    grade.rejected_reason =
      dto.status === 'rejected' ? (dto.rejected_reason ?? 'N/A') : 'N/A';
    grade.accepted_date = new Date();

    return grade.save();
  }
}
