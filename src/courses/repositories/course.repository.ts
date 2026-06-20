import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCourseDto } from 'courses/dto/create-course.dto';
import { QueryCourseDto } from 'courses/dto/query-course.dto';
import { Course, CourseDocument } from 'courses/schemas/course.schema';
import { Model } from 'mongoose';

@Injectable()
export class CoursesRepository {
  private handleError(error: any) {
    throw new InternalServerErrorException(error.message);
  }
  constructor(
    @InjectModel(Course.name)
    private readonly courseModel: Model<CourseDocument>,
  ) {}

  async getAllCourses() {
    try {
      return await this.courseModel.find();
    } catch (error) {
      this.handleError(error);
    }
  }

  async findCourseById(id: string) {
    try {
      return await this.courseModel.findById(id);
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAvailableCourses(query: QueryCourseDto) {
    const filter: any = {
      status: 'available',
    };

    if (query.categoryId) {
      filter.category_id = query.categoryId;
    }

    if (query.search) {
      filter.title = { $regex: query.search, $options: 'i' };
    }

    return this.courseModel.find(filter);
  }

  async addCourse(course: CreateCourseDto) {
    try {
      const newCourse = new this.courseModel(course);
      return await newCourse.save();
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateCourse(id: string, course: Partial<CreateCourseDto>) {
    try {
      return await this.courseModel.findByIdAndUpdate(id, course, {
        new: true,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteCourse(id: string) {
    try {
      return await this.courseModel.findByIdAndDelete(id);
    } catch (error) {
      this.handleError(error);
    }
  }
}
