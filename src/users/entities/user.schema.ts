import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { time } from 'console';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  address: string;

  constructor(name: string, lastName: string, address: string) {
    this.name = name;
    this.lastName = lastName;
    this.address = address;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
