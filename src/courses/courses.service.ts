import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CoursesRepository } from './repositories/course.repository';
import { QueryCourseDto } from './dto/query-course.dto';

@Injectable()
export class CoursesService {
  updateStatus(arg0: any, arg1: string) {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly coursesRepository: CoursesRepository) {}

  getAllCourses(user: any, query: QueryCourseDto) {
    if (user.role === 'student') {
      query.status = 'available';
      return this.coursesRepository.findAvailableCourses(query);
    }

    return this.coursesRepository.getAllCourses();
  }

  findCourseById(id: string) {
    return this.coursesRepository.findCourseById(id);
  }

  async getAvailableCourses(query: QueryCourseDto) {
    return this.coursesRepository.findAvailableCourses(query);
  }

  addCourse(createCourseDto: CreateCourseDto) {
    return this.coursesRepository.addCourse(createCourseDto);
  }

  updateCourse(id: string, updateCourseDto: UpdateCourseDto) {
    return this.coursesRepository.updateCourse(id, updateCourseDto);
  }

  deleteCourse(id: string) {
    return this.coursesRepository.deleteCourse(id);
  }
  updateCourseStatus(id: string, status: string) {
    return this.coursesRepository.updateCourseStatus(id, status);
  }
}
