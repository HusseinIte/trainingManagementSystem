import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentsController } from './enrollment.controller';

@Module({
  controllers: [EnrollmentsController],
  providers: [EnrollmentService],
})
export class EnrollmentModule {}
