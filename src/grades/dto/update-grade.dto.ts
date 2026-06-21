// dto/teacher-update-grade.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { TeacherAddGradeDto } from './teacher-add-grade.dto';

export class TeacherUpdateGradeDto extends PartialType(TeacherAddGradeDto) {}