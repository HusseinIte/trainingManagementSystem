import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type CategoryDocument = Category & Document;

@Schema({timestamps: true})
export class Category {
    @Prop({required: true})
    name: string;
    @Prop({required: true})
    description: string;
}
export const CategorySchema = SchemaFactory.createForClass(Category);