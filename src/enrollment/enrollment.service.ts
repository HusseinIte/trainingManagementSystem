import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CoursesService } from 'courses/courses.service';
import { Enrollment, EnrollmentDocument } from './schemas/enrollment.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CourseStatus } from 'courses/schemas/course.schema';
import {
  EnrollmentReviewStatus,
  ReviewEnrollmentDto,
} from './dto/review-enrollment.dto';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectModel(Enrollment.name)
    private enrollmentModel: Model<EnrollmentDocument>,
    private readonly coursesService: CoursesService,
  ) {}

  /** Student requests enrollment in a course */
  async create(studentId: string, courseId: string) {
    const course = await this.coursesService.findCourseById(courseId);
    if (!course) throw new NotFoundException('Course not found');

    if (course.status !== CourseStatus.AVAILABLE) {
      throw new BadRequestException(
        `This course is not open for enrollment (status: ${course.status})`,
      );
    }

    const existing = await this.enrollmentModel.findOne({
      student_id: studentId,
      course_id: courseId,
      status: { $in: ['PENDING_PAYMENT', 'ACCEPTED'] },
    });
    
    if (existing) {
      throw new ConflictException(
        'You already have an active enrollment for this course',
      );
    }

    return this.enrollmentModel.create({
      student_id: studentId,
      course_id: courseId,
      status: 'PENDING_PAYMENT',
      requested_date: new Date(),
    });
  }

  /** Admin: list enrollments for a course, optionally filtered by status */
  async findByCourse(courseId: string, status?: string) {
    const filter: Record<string, any> = { course_id: courseId };
    if (status && status !== 'all') filter.status = status;
    return this.enrollmentModel
      .find(filter)
      .populate('student_id', 'full_name email phone')
      .sort({ requested_at: -1 });
  }

  /** Admin: accept or reject a pending enrollment */
  async review(enrollmentId: string, dto: ReviewEnrollmentDto) {
    const enrollment = await this.enrollmentModel.findById(enrollmentId);
    if (!enrollment) throw new NotFoundException('Enrollment not found');

    if (enrollment.status !== 'PENDING_PAYMENT') {
      throw new BadRequestException(
        `Cannot review an enrollment with status ${enrollment.status}`,
      );
    }
    if (dto.status === EnrollmentReviewStatus.ACCEPTED) {
      const course = await this.coursesService.findCourseById(
        enrollment.course_id.toString(),
      );
      const acceptedCount = await this.enrollmentModel.countDocuments({
        course_id: enrollment.course_id,
        status: 'ACCEPTED',
      });
      if (acceptedCount >= course!.capacity) {
        throw new BadRequestException('Course capacity has been reached');
      }

      enrollment.status = 'ACCEPTED';
      enrollment.accepted_date = new Date();
      if (acceptedCount + 1 >= course!.capacity) {
        await this.coursesService.updateCourseStatus(
          course!._id.toString(),
          CourseStatus.FULL,
        );
      }
    } else if (dto.status === EnrollmentReviewStatus.REJECTED) {
      if (!dto.rejection_reason) {
        throw new BadRequestException(
          'A rejection reason is required when rejecting',
        );
      }
      enrollment.status = 'REJECTED';
      enrollment.rejected_reason = dto.rejection_reason;
    }

    return enrollment.save();
  }
  /** Student: their own enrollments, optionally filtered by status, with course populated */
  async findByStudent(studentId: string, status?: string) {
  const filter: Record<string, any> = { student_id: studentId };
  if (status && status !== 'all') filter.status = status;
  return this.enrollmentModel
    .find(filter)
    .populate({
      path: 'course_id',
      populate: { path: 'category_id' },
    })
    .sort({ requested_at: -1 });
}

  /** Teacher: roster of accepted students in one of their own courses */
  async findByCourseForTeacher(teacherId: string, courseId: string) {
    const course = await this.coursesService.findCourseById(courseId);
    if (!course) throw new NotFoundException('Course not found');
    if (course.teacher_id.toString() !== teacherId) {
      throw new ForbiddenException('You do not teach this course');
    }
    return this.enrollmentModel
      .find({ course_id: courseId, status: 'ACCEPTED' })
      .populate('student_id', 'full_name email phone');
  }

  /** Used internally by GradesService to verify an enrollment belongs to a given student */
  async findOne(enrollmentId: string) {
    const enrollment = await this.enrollmentModel.findById(enrollmentId);
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    return enrollment;
  }
}
