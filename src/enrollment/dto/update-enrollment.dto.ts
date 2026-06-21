import { PartialType } from '@nestjs/mapped-types';
import { ReviewEnrollmentDto } from './review-enrollment.dto';

export class UpdateEnrollmentDto extends PartialType(ReviewEnrollmentDto) {}
