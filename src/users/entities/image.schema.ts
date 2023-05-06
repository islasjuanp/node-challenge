import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export type ImageDocument = Image & Document;

@Schema()
export class Image {
  @Prop()
  _id: ObjectId;
  @Prop()
  filename: string;

  @Prop()
  contentType: string;

  @Prop()
  length: number;

  @Prop()
  uploadDate: Date;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
