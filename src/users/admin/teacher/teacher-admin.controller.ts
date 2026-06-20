import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

import { TeacherAdminService } from './teacher-admin.service';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { UserDocument } from '../../schemas/user.schema';
import { JwtAuthGuard } from 'auth/authentication/jwt-auth.guard';
import { RolesGuard } from 'auth/authorization/roles.guard';
import { Roles } from 'auth/authorization/roles.decorator';

@Controller('admin/teachers')
export class TeacherAdminController {
  constructor(private readonly teacherAdminService: TeacherAdminService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findAll(@Query('status') status?: string): Promise<
    Array<{
      id: string;
      full_name: string;
      email: string;
      phone: string;
      status: string;
    }>
  > {
    const users = status
      ? await this.teacherAdminService.findByStatus(status)
      : await this.teacherAdminService.findAll();

    return users.map((user: any) => this.toResponse(user));
  }

  @Get(':teacherId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async findOne(@Param('teacherId') teacherId: string): Promise<{
    id: string;
    full_name: string;
    email: string;
    phone: string;
    status: string;
  }> {
    if (!isValidObjectId(teacherId)) {
      throw new BadRequestException('Invalid teacher ID format');
    }

    const user = await this.teacherAdminService.findById(teacherId);

    if (!user) {
      throw new NotFoundException('Teacher not found');
    }

    return this.toResponse(user as any);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createTeacher(@Body() createTeacherDto: CreateTeacherDto) {
    const dto = {
      ...createTeacherDto,
      status: createTeacherDto.status ?? 'ACTIVE',
    };

    try {
      return await this.teacherAdminService.create(dto);
    } catch (error) {
      const err = error as any;
      const message = (err?.message ?? '').toLowerCase();

      // Handle Mongoose unique constraint violations (email/phone)
      if (err?.code === 11000 || message.includes('duplicate key')) {
        if (message.includes('email')) {
          throw new ConflictException('Email already exists');
        }
        if (message.includes('phone')) {
          throw new ConflictException('Phone already exists');
        }
        throw new ConflictException('Teacher already exists');
      }

      // If Nest HTTP exception already exists, rethrow
      if (typeof err?.getStatus === 'function') {
        throw error;
      }

      // Likely validation/bad payload
      if (
        message.includes('validation') ||
        message.includes('required') ||
        message.includes('cast')
      ) {
        throw new BadRequestException(err?.message ?? 'Invalid teacher data');
      }

      throw new InternalServerErrorException('Failed to create teacher');
    }
  }

  @Put(':teacherId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateTeacher(
    @Param('teacherId') teacherId: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
  ) {
    if (!isValidObjectId(teacherId)) {
      throw new BadRequestException('Invalid teacher ID format');
    }

    try {
      const { email, ...updateData } = updateTeacherDto;

      const updatedUser = await this.teacherAdminService.update(
        teacherId,
        updateData,
      );

      if (!updatedUser) {
        throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
      }

      return this.toResponse(updatedUser as any);
    } catch (error) {
      const err = error as any;
      const message = (err?.message ?? '').toLowerCase();

      if (err?.code === 11000 || message.includes('duplicate key')) {
        if (message.includes('email')) {
          throw new ConflictException('Email already exists');
        }
        if (message.includes('phone')) {
          throw new ConflictException('Phone already exists');
        }
        throw new ConflictException('Teacher already exists');
      }

      if (
        message.includes('validation') ||
        message.includes('required') ||
        message.includes('cast')
      ) {
        throw new BadRequestException(err?.message ?? 'Invalid teacher data');
      }

      if (typeof err?.getStatus === 'function') {
        throw error;
      }

      throw new InternalServerErrorException('Failed to update teacher');
    }
  }

  @Delete(':teacherId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteTeacher(@Param('teacherId') teacherId: string) {
    // Validate ObjectId format
    if (!isValidObjectId(teacherId)) {
      throw new BadRequestException('Invalid teacher ID format');
    }

    try {
      const result = await this.teacherAdminService.delete(teacherId);

      // For Mongoose, if result is null, no document was found
      if (!result) {
        throw new NotFoundException(`Teacher with ID ${teacherId} not found`);
      }

      return {
        statusCode: 200,
        message: 'Teacher deleted successfully',
        data: {
          id: teacherId,
          deleted: true,
        },
      };
    } catch (error) {
      // If it's already a NestJS HTTP exception, rethrow it
      if (error.getStatus && typeof error.getStatus === 'function') {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete teacher');
    }
  }
  private toResponse(user: UserDocument) {
    const anyUser = user as any;

    return {
      id: String(anyUser?._id ?? ''),
      full_name: anyUser?.full_name ?? anyUser?.fullname,
      email: anyUser?.email,
      phone: anyUser?.phone,
      status: anyUser?.status,
      role: anyUser?.role,
    };
  }
}
