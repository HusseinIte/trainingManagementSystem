import { Injectable } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';

@Injectable()
export class EnrollmentService {
  create(id: any, courseId: string) {
    throw new Error('Method not implemented.');
  }
  // @Roles('teacher')
  findByCourseForTeacher(id: any, courseId: string) {
    throw new Error('Method not implemented.');
  }
  //@Roles('admin')
  review(id: string, dto: { status: string; rejection_reason?: string }) {
    throw new Error('Method not implemented.');
  }
  //@Roles('admin')
  findByCourse(courseId: string, status: string | undefined) {
    throw new Error('Method not implemented.');
  }
  //@Roles('student')
  findByStudent(studentId: string, status?: string) {}
}


