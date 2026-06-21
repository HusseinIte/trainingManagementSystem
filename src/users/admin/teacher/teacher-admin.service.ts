import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'users/users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TeacherAdminService {
  constructor(private readonly userRepository: UsersRepository) {}
  private readonly DEFAULT_ROLE = 'teacher';

  findByStatus(status: string) {
    return this.userRepository.findByStatus(status);
  }

  findByStatusRole(status: string, role: string = this.DEFAULT_ROLE) {
    return this.userRepository.findByStatusRole(status, role);
  }

  findAll() {
    return this.userRepository.findByRole(this.DEFAULT_ROLE);
  }

  findById(id: string) {
    return this.userRepository.findById(id);
  }

  async create(createTeacherDto: CreateTeacherDto) {
    // This app's schema doesn't contain `role`, but keeping the intent.
    createTeacherDto.role = 'teacher';
    const hashedPassword = await bcrypt.hash(createTeacherDto.password, 10);

    try {
      return this.userRepository.create({
        ...createTeacherDto,
        password: hashedPassword,
      });
    } catch (error) {
      throw new Error(`error happened in service teacher: ${error}`);
    }
  }
  async update(id, updateTeacherDto: UpdateTeacherDto) {
    // This app's schema doesn't contain `role`, but keeping the intent.

    try {
      return this.userRepository.update(id, updateTeacherDto);
    } catch (error) {
      throw new Error(`error happened in service teacher: ${error}`);
    }
  }
  async delete(id) {
    // This app's schema doesn't contain `role`, but keeping the intent.

    try {
      return this.userRepository.delete(id);
    } catch (error) {
      throw new Error(`error happened in service teacher: ${error}`);
    }
  }
}
