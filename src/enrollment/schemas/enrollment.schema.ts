import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export type EnrollmentDocument = Enrollment & Document;

@Schema({ timestamps: true })
export class Enrollment {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Users' })
  student_id: Types.ObjectId;
  @Prop({ type: Types.ObjectId, required: true, ref: 'Courses' })
  course_id: Types.ObjectId;
  @Prop({ required: true, enum: ['PENDING_PAYMENT', 'ACCEPTED', 'REJECTED'] })
  status: string;
  @Prop()
  requested_date: Date;
  @Prop()
  accepted_date: Date;
  @Prop()
  rejected_reason: string;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
