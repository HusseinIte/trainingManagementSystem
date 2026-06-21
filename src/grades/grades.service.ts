import { Injectable } from '@nestjs/common';
import { TeacherAddGradeDto } from './dto/create-grade.dto';
import { TeacherUpdateGradeDto } from './dto/update-grade.dto';

@Injectable()
export class GradesService {
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
