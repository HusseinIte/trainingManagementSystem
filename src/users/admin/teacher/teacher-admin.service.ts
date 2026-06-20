import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'users/users.repository';
import * as bcrypt from 'bcrypt';
@Injectable()
export class TeacherAdminService {
  constructor(private readonly userRepository: UsersRepository) {}

  findAll(status?: string) {
    return this.userRepository.findByRole('teacher', status);
  }

  findById(id: string) {
    return this.userRepository.findById(id);
  }

  async create(createTeacherDto: CreateTeacherDto) {
    // This app's schema doesn't contain `role`, but keeping the intent.
    createTeacherDto.role = 'teacher';

    // Create teacher as a user.
    try {
      const hashPassword = await bcrypt.hash(createTeacherDto.password, 10);
      const result = await this.userRepository.create({
        ...createTeacherDto,
        password: hashPassword,
      });

      const { password: _, ...teacher } = result.toObject();
      return teacher;
    } catch (error) {
      throw new Error(`error happened in service teacher: ${error}`);
    }
  }
  async update(id, updateTeacherDto: UpdateTeacherDto) {
    // This app's schema doesn't contain `role`, but keeping the intent.
    // Create teacher as a user.
    try {
      return this.userRepository.update(id, updateTeacherDto);
    } catch (error) {
      throw new Error(`error happened in service teacher: ${error}`);
    }
  }
  async delete(id) {
    // This app's schema doesn't contain `role`, but keeping the intent.
    // Create teacher as a user.
    try {
      return this.userRepository.delete(id);
    } catch (error) {
      throw new Error(`error happened in service teacher: ${error}`);
    }
  }
}
