import { Injectable } from '@nestjs/common';
import { TeacherAddGradeDto } from './dto/create-grade.dto';
import { TeacherUpdateGradeDto } from './dto/update-grade.dto';
import { GradesRepository } from './grades.repository';

@Injectable()
export class GradesService {
  constructor(private readonly gradesRepository: GradesRepository) {}

  async getStudentGrades(studentId: string) {
    const grades = await this.gradesRepository.findGradesForStudent(studentId);

    return grades
      .filter((grade) => grade.enrollment_id)
      .map((grade) => {
        const enrollment = grade.enrollment_id as any;

        return {
          grade_id: grade._id,
          enrollment_id: enrollment._id,
          grade_value: grade.grade_value,
          result: grade.result,
          notes: grade.notes ?? null,
          accepted_at: enrollment.accepted_date ?? null,
          course: enrollment.course_id,
        };
      });
  }

  create(createGradeDto: TeacherAddGradeDto) {
    return 'This action adds a new grade';
  }

  findAll() {
    return `This action returns all grades`;
  }

  findOne(id: number) {
    return `This action returns a #${id} grade`;
  }

  update(id: number, updateGradeDto: TeacherUpdateGradeDto) {
    return `This action updates a #${id} grade`;
  }

  remove(id: number) {
    return `This action removes a #${id} grade`;
  }
}
