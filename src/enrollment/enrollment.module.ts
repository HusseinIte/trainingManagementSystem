import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentsController } from './enrollment.controller';
import { Enrollment, EnrollmentSchema } from './schemas/enrollment.schema';
import { CoursesModule } from 'courses/courses.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Enrollment.name, schema: EnrollmentSchema }]),
    CoursesModule,
  ],
  controllers: [EnrollmentsController],
  providers: [EnrollmentService], 
  exports: [EnrollmentService],
})
export class EnrollmentModule {}