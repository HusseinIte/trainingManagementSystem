import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CoursesRepository } from './repositories/course.repository';
import { QueryCourseDto } from './dto/query-course.dto';
import { CourseStatus } from './schemas/course.schema';

@Injectable()
export class CoursesService {
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
  async updateCourseStatus(id: string, status: CourseStatus) {
    const updated = await this.coursesRepository.updateCourseStatus(id, status);
    if (!updated) {
      throw new NotFoundException('Course not found');
    }
    return updated;
  }

  async getCoursesForTeacher(teacherId: string, status?: string) {
    return this.coursesRepository.findCoursesByTeacher(teacherId, status);
  }
}
