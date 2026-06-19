// users.service.ts

import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { UserDocument } from './users.schema';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const userExists = await this.usersRepository.findByEmail(
      createUserDto.email,
    );

    if (userExists) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    return this.toResponse(user);
  }

  async findAll() {
    const users = await this.usersRepository.findAll();

    return users.map((user) => this.toResponse(user));
  }

  findByEmailWithPassword(email: string) {
    return this.usersRepository.findByEmailWithPassword(email);
  }

  findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  private toResponse(user: UserDocument) {
    return {
      id: user._id,
      full_name: user.full_name,
      email: user.email,
      phone: user.phone,
      status: user.status,
    };
  }
}
