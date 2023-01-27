import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type LinkDataDocument = LinkData & Document;
@Schema({ collection: 'LinkData' })
export class LinkData {
  _id: mongoose.Schema.Types.ObjectId;
  @Prop()
  oldUrl: string;
  @Prop()
  newUrl: string;
  @Prop()
  short: string;
  @Prop()
  status: string;
  @Prop()
  visitors: number;
  @Prop()
  lastDatevisitor: Date;
  @Prop()
  createDate: Date;
}

export const LinkDataSchema = SchemaFactory.createForClass(LinkData);
