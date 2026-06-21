import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type GradeDocument = Grades & Document;

@Schema({ timestamps: true })
export class Grades {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Users' })
  student_id: Types.ObjectId;
  @Prop({ required: true, ref: 'Courses' })
  course_id: string;
  @Prop({ required: true, enum: ['pending', 'accepted', 'rejected'] })
  status: string;
  @Prop({ required: true })
  requested_date: Date;
  @Prop({ required: true })
  accepted_date: Date;
  @Prop({ required: true })
  rejected_reason: string;
  @Prop({ required: true })
  grade_value: string;
}

export const GradesSchema = SchemaFactory.createForClass(Grades);
