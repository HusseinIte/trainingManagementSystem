// dto/create-user.dto.ts

import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsString()
  phone: string;

  @IsEnum(['ACTIVE', 'INACTIVE'])
  status: string;

  @IsEnum(['student', 'teacher', 'admin'])
  role: string;
}
