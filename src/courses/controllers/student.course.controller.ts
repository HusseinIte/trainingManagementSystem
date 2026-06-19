import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { CoursesService } from '../courses.service';

@Controller('students')
export class StudentCourseController {
  constructor(private readonly coursesService: CoursesService) {}

  // @Get('me/courses')
  //   async getMyCourses(@Req() req, @Query('status') status?: string) {
  //     return this.coursesService.getAvailableCourses();
  //   }

  // @Get('me/grades')
  //   async getMyCourses(@Req() req, @Query('grades  ') status?: string) {
  //     return this.coursesService.getAvailableCourses();
  //   }

}
