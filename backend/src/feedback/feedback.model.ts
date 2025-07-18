import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FeedbackDocument = HydratedDocument<Feedback>;

@Schema()
export class Feedback {
  @Prop({ required: true })
  lines: string[];

  @Prop()
  uid?: string;

  @Prop()
  created: Date;
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
