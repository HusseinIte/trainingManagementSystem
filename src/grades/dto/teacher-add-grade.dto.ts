import { IsEnum, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export enum GradeResult { PASSED = 'PASSED', FAILED = 'FAILED' }

export class TeacherAddGradeDto {
  @IsNumber() @Min(0) @Max(100)
  grade_value: number;

  @IsEnum(GradeResult)
  result: GradeResult;

  @IsOptional() @IsString()
  notes?: string;
}