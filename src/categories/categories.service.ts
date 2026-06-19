import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepository } from './categories.repository';
import { CategoryDocument } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.categoriesRepository.findByName(
      createCategoryDto.name,
    );

    if (existingCategory) {
      throw new ConflictException('Category name already exists');
    }

    const category = await this.categoriesRepository.create(createCategoryDto);
    return this.toResponse(category);
  }

  async findAll() {
    const categories = await this.categoriesRepository.findAll();
    return categories.map((category) => this.toResponse(category));
  }

  async findOne(id: string) {
    const category = await this.categoriesRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.toResponse(category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    if (updateCategoryDto.name) {
      const existingCategory = await this.categoriesRepository.findByName(
        updateCategoryDto.name,
      );

      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException('Category name already exists');
      }
    }

    const updatedCategory = await this.categoriesRepository.updateById(
      id,
      updateCategoryDto,
    );

    if (!updatedCategory) {
      throw new NotFoundException('Category not found');
    }

    return this.toResponse(updatedCategory);
  }

  async remove(id: string) {
    const deletedCategory = await this.categoriesRepository.deleteById(id);

    if (!deletedCategory) {
      throw new NotFoundException('Category not found');
    }

    return this.toResponse(deletedCategory);
  }

  private toResponse(category: CategoryDocument) {
    return {
      id: category._id.toString(),
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
