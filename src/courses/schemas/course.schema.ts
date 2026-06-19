import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type CourseDocument = Course & Document;

export enum CourseStatus {
  AVAILABLE = 'available',
  FULL = 'full',
  COMPLETED = 'completed',
  FINISHED = 'finished',
  CANCELLED = 'cancelled',
  UPCOMING = 'upcoming',
}

@Schema({ timestamps: true })
export class Course {
  @Prop({ type: Types.ObjectId, ref: 'CourseCategory', required: true })
  category_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  teacher_id: Types.ObjectId;

  @Prop({ required: true, index: true })
  title: string;

  @Prop({ required: true, index: true })
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  capacity: number;

  @Prop({ required: true, index: true })
  start_date: Date;

  @Prop({ required: true, index: true })
  end_date: Date;

  @Prop({
    type: String,
    enum: CourseStatus,
    default: CourseStatus.AVAILABLE,
    index: true,
  })
  status: CourseStatus;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
