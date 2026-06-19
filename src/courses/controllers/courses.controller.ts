import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CoursesService } from '../courses.service';
import { UpdateCourseDto } from '../dto/update-course.dto';
import { CreateCourseDto } from '../dto/create-course.dto';
import { QueryCourseDto } from '../dto/query-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  @Get(':id')
  findCourseById(@Param('id') id: string) {
    return this.coursesService.findCourseById(id);
  }

  @Get()
  getAvailableCourses(@Query() query: QueryCourseDto) {
    return this.coursesService.getAvailableCourses(query);
  }

  @Post()
  addCourse(@Body() createCourseDto: CreateCourseDto) {
    return this.coursesService.addCourse(createCourseDto);
  }

  @Patch(':id')
  updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.updateCourse(id, updateCourseDto);
  }

  @Delete(':id')
  deleteCourse(@Param('id') id: string) {
    return this.coursesService.deleteCourse(id);
  }
}
