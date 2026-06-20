import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { User, UserSchema } from 'users/schemas/user.schema';
import { Course, CourseSchema } from 'courses/schemas/course.schema';
import {
  Enrollment,
  EnrollmentSchema,
} from 'enrollment/schemas/enrollment.schema';
import { Category, CategorySchema } from 'categories/schemas/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Course.name, schema: CourseSchema },
      { name: Enrollment.name, schema: EnrollmentSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
