import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'auth/authentication/jwt-auth.guard';
import { RolesGuard } from 'auth/authorization/roles.guard';
import { Roles } from 'auth/authorization/roles.decorator';
import { CurrentUser } from 'auth/common/decorators/current-user.decorator';
import { CoursesService } from './courses.service';

@Controller('teachers/me')
export class TeacherCoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get('courses')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('teacher')
  getMyCourses(@CurrentUser() user: any, @Query('status') status?: string) {
    console.log('User:', user);
    return this.coursesService.getCoursesForTeacher(user.id, status);
  }
}