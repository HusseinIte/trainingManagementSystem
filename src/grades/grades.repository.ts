import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EnrollmentDocument } from '../enrollment/schemas/enrollment.schema';
import { GradeDocument } from './schemas/grade.schema';

@Injectable()
export class GradesRepository {
  constructor(
    @InjectModel('Grades') private readonly gradeModel: Model<GradeDocument>,
    @InjectModel('Enrollment')
    private readonly enrollmentModel: Model<EnrollmentDocument>,
  ) {}

  async findAcceptedEnrollmentsForStudent(studentId: string) {
    return this.enrollmentModel
      .find({ student_id: studentId, status: 'ACCEPTED' })
      .select('_id course_id accepted_date')
      .populate('course_id', 'title start_date end_date status')
      .sort({ accepted_date: -1, createdAt: -1 });
  }

  async findGradesByEnrollmentIds(enrollmentIds: Array<string | Types.ObjectId>) {
    return this.gradeModel
      .find({ enrollment_id: { $in: enrollmentIds } })
      .sort({ updated_at: -1, created_at: -1 });
  }

  async findGradesForStudent(studentId: string) {
    return this.gradeModel
      .find()
      .populate({
        path: 'enrollment_id',
        match: {
          student_id: new Types.ObjectId(studentId),
          status: 'ACCEPTED',
        },
        select: '_id course_id accepted_date',
        populate: {
          path: 'course_id',
          select: 'title start_date end_date status',
        },
      })
      .sort({ updated_at: -1, created_at: -1 });
  }
}
