import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { ReviewEnrollmentDto } from './dto/review-enrollment.dto';
import { JwtAuthGuard } from 'auth/authentication/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentService) {}

  @Post('courses/:courseId/enrollments')
  request(@Req() req, @Param('courseId') courseId: string) {
    return this.enrollmentsService.create(req.user.id, courseId);
  }

  @Get('admin/courses/:courseId/enrollments')
  listForCourse(
    @Param('courseId') courseId: string,
    @Query('status') status?: string,
  ) {
    return this.enrollmentsService.findByCourse(courseId, status);
  }

  @Post('admin/enrollments/:id')
  review(@Param('id') id: string, @Body() dto: ReviewEnrollmentDto) {
    return this.enrollmentsService.review(id, dto);
  }

  @Get('students/me/courses')
  myCourses(@Req() req, @Query('status') status?: string) {
    return this.enrollmentsService.findByStudent(req.user.id, status);
  }

  @Get('teachers/me/courses/:courseId/students')
  studentsInCourse(@Req() req, @Param('courseId') courseId: string) {
    return this.enrollmentsService.findByCourseForTeacher(
      req.user.id,
      courseId,
    );
  }
}
