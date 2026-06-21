import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CourseSchema } from './schemas/course.schema';
import { CoursesRepository } from './repositories/course.repository';
import { EnrollmentSchema } from 'enrollment/schemas/enrollment.schema';
import { TeacherCoursesController } from './teacher-courses.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Course', schema: CourseSchema },
      { name: 'Enrollment', schema: EnrollmentSchema },
    ]),
  ],
  controllers: [CoursesController,TeacherCoursesController],
  providers: [CoursesService, CoursesRepository],
  exports: [CoursesService],
})
export class CoursesModule {}
