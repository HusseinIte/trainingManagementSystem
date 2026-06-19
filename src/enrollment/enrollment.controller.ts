import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';

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
  review(
    @Param('id') id: string,
    @Body() dto: { status: string; rejection_reason?: string },
  ) {
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
