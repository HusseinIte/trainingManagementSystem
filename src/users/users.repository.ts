// users.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  create(data: Partial<User>) {
    return this.userModel.create(data);
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  findByEmailWithPassword(email: string) {
    return this.userModel.findOne({ email }).select('+password');
  }

  findById(id: string) {
    return this.userModel.findById(id);
  }

  findAll() {
    return this.userModel.find();
  }
}
