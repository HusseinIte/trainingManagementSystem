import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeacherAddGradeDto } from '../../dto/teacher-add-grade.dto';
import { Grades, GradeDocument } from '../../schemas/grade.schema';
import {
  Enrollment,
  EnrollmentDocument,
} from '../../../enrollment/schemas/enrollment.schema';
import { CourseDocument } from '../../../courses/schemas/course.schema';

@Injectable()
export class TeacherGradeService {
  constructor(
    @InjectModel(Grades.name)
    private readonly gradeModel: Model<GradeDocument>,
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<EnrollmentDocument>,
    @InjectModel('Course')
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
      course_id: Number(courseId) as any,
    });

    if (existing) {
      // Per requirement: create if missing; if already exists, return existing (no update here)
      return existing;
    }

    const now = new Date();
    const gradePayload: Partial<Grades> = {
      student_id: enrollment.student_id,
      course_id: Number(courseId) as any,
      status: dto.status,
      requested_date: now,
      accepted_date: dto.status === 'rejected' ? now : now,
      rejected_reason: dto.status === 'rejected' ? dto.rejected_reason : 'N/A',
    };

    // If rejected, keep accepted_date as required by schema.
    // If pending, keep rejected_reason empty string.

    const created = new this.gradeModel(gradePayload);
    return created.save();
  }
}
