import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

export type EventStatus = 'CREATED' | 'ACTIVE' | 'INACTIVE';

@Schema()
export class Event {
  @Expose()
  @Prop({ required: true })
  signature: string;

  @Expose()
  @Prop({ required: true })
  promoterUid: string;

  @Expose()
  @Prop({ required: true })
  status: EventStatus;

  @Expose()
  @Prop()
  name: string;

  @Expose()
  @Prop()
  startDate: Date;

  @Expose()
  @Prop()
  endDate?: Date;

  @Prop({ type: Object })
  formData: any;

  @Prop()
  created: Date;

  @Prop()
  modified: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
