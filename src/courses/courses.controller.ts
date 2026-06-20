import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Put,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { QueryCourseDto } from './dto/query-course.dto';
import { JwtAuthGuard } from 'auth/authentication/jwt-auth.guard';
import { RolesGuard } from 'auth/authorization/roles.guard';
import { Roles } from 'auth/authorization/roles.decorator';
import { CurrentUser } from 'auth/common/decorators/current-user.decorator';
import { CourseStatus } from './schemas/course.schema';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @UseGuards(JwtAuthGuard)

  getCourses(@CurrentUser() user: any, @Query() query: QueryCourseDto) {
    if (user?.role === 'admin') {
    return this.coursesService.getAllCourses(user, query);
  }
  return this.coursesService.getAvailableCourses(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findCourseById(@Param('id') id: string) {
    return this.coursesService.findCourseById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  addCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.addCourse(createCourseDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.updateCourse(id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  deleteCourse(@Param('id') id: string) {
    return this.coursesService.deleteCourse(id);
  }
  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  updateCourseStatus(
    @Param('id') id: string,
    @Body('status') status: CourseStatus,
  ) {
    return this.coursesService.updateCourseStatus(id, status);
  }
}
