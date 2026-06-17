// users.service.ts

import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { UserDocument } from './users.schema';

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

    const user = await this.usersRepository.create(createUserDto);

    return this.toResponse(user);
  }

  async findAll() {
    const users = await this.usersRepository.findAll();

    return users.map((user) => this.toResponse(user));
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
