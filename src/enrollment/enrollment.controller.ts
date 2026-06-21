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
import { RolesGuard } from 'auth/authorization/roles.guard';
import { Roles } from 'auth/authorization/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller()
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentService) {}

  @Post('courses/:courseId/enrollments')
  @Roles('student')
  request(@Req() req, @Param('courseId') courseId: string) {
    return this.enrollmentsService.create(req.user.id, courseId);
  }

  @Get('admin/courses/:courseId/enrollments')
  @Roles('admin')
  listForCourse(
    @Param('courseId') courseId: string,
    @Query('status') status?: string,
  ) {
    return this.enrollmentsService.findByCourse(courseId, status);
  }

  @Post('admin/enrollments/:id')
  @Roles('admin')
  review(@Param('id') id: string, @Body() dto: ReviewEnrollmentDto) {
    return this.enrollmentsService.review(id, dto);
  }

  @Get('students/me/courses')
  @Roles('student')
  myCourses(@Req() req, @Query('status') status?: string) {
    return this.enrollmentsService.findByStudent(req.user.id, status);
  }

  @Get('teachers/me/courses/:courseId/students')
  @Roles('teacher')
  studentsInCourse(@Req() req, @Param('courseId') courseId: string) {
    return this.enrollmentsService.findByCourseForTeacher(
      req.user.id,
      courseId,
    );
  }
}