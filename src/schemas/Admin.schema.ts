import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Admin {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop({ required: true })
  password: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
