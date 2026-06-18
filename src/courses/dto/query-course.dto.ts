import { IsOptional, IsString } from 'class-validator';

export class QueryCourseDto {
  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsString()
  search?: string;
}