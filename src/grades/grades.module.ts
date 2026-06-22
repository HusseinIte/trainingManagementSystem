import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GradesService } from './grades.service';
import { GradesController } from './grades.controller';
import { GradesSchema } from './schemas/grade.schema';
import { EnrollmentSchema } from '../enrollment/schemas/enrollment.schema';
import { CourseSchema } from '../courses/schemas/course.schema';
import { TeacherGradeController } from './dashborad/teacher-grade/teacher-grade.controller';
import { TeacherGradeService } from './dashborad/teacher-grade/teacher-grade.service';
import { StudentGradeController } from './dashborad/student-grade/student-grade.controller';
import { GradesRepository } from './grades.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Grades', schema: GradesSchema },
      { name: 'Enrollment', schema: EnrollmentSchema },
      { name: 'Course', schema: CourseSchema },
    ]),
  ],
  controllers: [
    GradesController,
    TeacherGradeController,
    StudentGradeController,
  ],
  providers: [GradesService, GradesRepository, TeacherGradeService],
})
export class GradesModule {}
