import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enrollment, EnrollmentDocument } from './schemas/enrollment.schema';

@Injectable()
export class EnrollmentRepository {
  findByCourseForTeacher(courseId: string) {
    return this.enrollmentModel
      .find({ course_id: courseId, status: 'ACCEPTED' })
      .populate('student_id', 'full_name email phone');
  }
  private handleError(error: any) {
    throw new InternalServerErrorException(error.message);
  }
  constructor(
    @InjectModel(Enrollment.name)
    private readonly enrollmentModel: Model<EnrollmentDocument>,
  ) {}

  async getEnrollments() {
    try {
      return await this.enrollmentModel.find();
    } catch (error) {
      this.handleError(error);
    }
  }

  /** Used internally by GradesService to verify an enrollment belongs to a given student */
  async findOne(enrollmentId: string) {
    const enrollment = await this.enrollmentModel.findById(enrollmentId);
    if (!enrollment) throw new NotFoundException('Enrollment not found');
    return enrollment;
  }

  async findEnrollmentById(id: string) {
    try {
      return await this.enrollmentModel.findById(id);
    } catch (error) {
      this.handleError(error);
    }
  }

  async findEnrollment(studentId: string, courseId: string) {
    try {
      return this.enrollmentModel.findOne({
        student_id: studentId,
        course_id: courseId,
        status: { $in: ['pending', 'accepted'] },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async addEnrollment(studentId: string, courseId: string) {
    try {
      return this.enrollmentModel.create({
        student_id: studentId,
        course_id: courseId,
        status: 'PENDING_PAYMENT',
        requested_date: new Date(),
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateEnrollment(id: string, enrollment: Partial<Enrollment>) {
    try {
      return await this.enrollmentModel.findByIdAndUpdate(id, enrollment, {
        new: true,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteEnrollment(id: string) {
    try {
      return await this.enrollmentModel.findByIdAndDelete(id);
    } catch (error) {
      this.handleError(error);
    }
  }
}
