import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  create(data: Partial<Category>) {
    return this.categoryModel.create(data);
  }

  findAll() {
    return this.categoryModel.find().sort({ createdAt: -1 });
  }

  findById(id: string) {
    return this.categoryModel.findById(id);
  }

  findByName(name: string) {
    return this.categoryModel.findOne({ name });
  }

  updateById(id: string, data: Partial<Category>) {
    return this.categoryModel.findByIdAndUpdate(id, data, { new: true });
  }

  deleteById(id: string) {
    return this.categoryModel.findByIdAndDelete(id);
  }
}
