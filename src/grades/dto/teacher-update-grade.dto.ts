import { IsIn, IsOptional, IsString } from 'class-validator';

export class TeacherUpdateGradeDto {
  @IsIn(['pending', 'accepted', 'rejected'])
  status: 'pending' | 'accepted' | 'rejected';

  @IsOptional()
  @IsString()
  rejected_reason?: string;
}

