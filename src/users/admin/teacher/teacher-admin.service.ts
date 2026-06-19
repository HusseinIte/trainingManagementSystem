import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'users/users.repository';

@Injectable()
export class TeacherAdminService {
  constructor(private readonly userRepository: UsersRepository) {}

  findByStatus(status: string) {
    return this.userRepository.findByStatus(status);
  }

  findAll() {
    return this.userRepository.findAll();
  }

  findById(id: string) {
    return this.userRepository.findById(id);
  }

  async create(createTeacherDto: CreateTeacherDto) {
    // This app's schema doesn't contain `role`, but keeping the intent.
    createTeacherDto.role = 'teacher';

    // Create teacher as a user.
    try {
      return this.userRepository.create(createTeacherDto);
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
