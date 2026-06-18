import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


export type EnrollmentDocument = Enrollment & Document;

@Schema({timestamps: true})
export class Enrollment {
    @Prop({required: true,ref: 'Users'})
    student_id: number;
    @Prop({required: true,ref: 'Courses'})
    course_id: number;
    @Prop({required: true, enum: ["pending", "accepted", "rejected"]})
    status: string;
    @Prop({required: true})
    requested_date: Date;
    @Prop({required: true})
    accepted_date: Date;
    @Prop({required: true})
    rejected_reason: string;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);