import { IsString, IsNumber, IsDateString, IsIn } from 'class-validator';

export class CreateCourseDto {
  @IsNumber()
  category_id: number;

  @IsNumber()
  teacher_id: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsNumber()
  capacity: number;

  @IsDateString()
  start_date: Date;

  @IsDateString()
  end_date: Date;

  @IsIn(['available', 'full', 'completed', 'finished', 'cancelled', 'upcoming'])
  status: string;
}
