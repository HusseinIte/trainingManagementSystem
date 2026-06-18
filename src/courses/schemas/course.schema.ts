import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type CourseDocument = Course & Document;

@Schema({timestamps: true})
export class Course {
    @Prop({required: true, unique: true,ref: 'CourseCategory'})
    category_id: number;
    @Prop({required: true, unique: true,ref: 'Teachers'})
    teacher_id: number;
    @Prop({required: true})
    title: string;
    @Prop({required: true})
    description: string;
    @Prop({required: true})
    price: number;
    @Prop({required: true})
    capacity: number;
    @Prop({required: true})
    start_date: Date;
    @Prop({required: true})
    end_date: Date;
    @Prop({required: true, enum: ["available", "full", "completed","finished", "cancelled", "upcoming"]})
    status: string;
}
export const CourseSchema = SchemaFactory.createForClass(Course);