import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type GradeDocument = Grade & Document;

@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Grade {
  @Prop({ type: Types.ObjectId, ref: 'Enrollment', required: true, unique: true })
  enrollment_id: Types.ObjectId;

  @Prop({ required: true })
  grade_value: number;

  @Prop({ enum: ['PASSED', 'FAILED'], required: true })
  result: string;

  @Prop()
  notes: string;
}

export const GradesSchema = SchemaFactory.createForClass(Grade);
