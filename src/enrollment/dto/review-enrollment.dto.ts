import { IsEnum, IsOptional, IsString } from 'class-validator';
export enum EnrollmentReviewStatus {
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export class ReviewEnrollmentDto {
  @IsEnum(EnrollmentReviewStatus)
  status: EnrollmentReviewStatus;

  @IsOptional()
  @IsString()
  rejection_reason?: string;
}
