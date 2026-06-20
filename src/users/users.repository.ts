// users.repository.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  create(data: Partial<User>) {
    try {
      return this.userModel.create(data);
    } catch (error) {
      throw new Error(`error happen in: ${error}`);
    }
  }

  update(id, data: Partial<User>) {
    try {
      return this.userModel.findByIdAndUpdate(
        id,
        { $set: data },
        {
          new: true, // Return updated document
        },
      );
    } catch (error) {
      throw new Error(`error happen in: ${error}`);
    }
  }

  delete(id: string) {
    // Validate ObjectId
    const result = this.userModel.findByIdAndDelete(id);
    return result;
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

  findByStatus(status: string) {
    return this.userModel.find({ status });
  }

  findByStatusRole(status: string, role: string) {
    return this.userModel.find({ status, role });
  }

  findAll() {
    return this.userModel.find();
  }

  findByRole(role: string) {
    return this.userModel.find({ role });
  }
}
