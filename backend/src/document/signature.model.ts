import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Expose } from 'class-transformer';
import { HydratedDocument } from 'mongoose';
import { Size } from '../profile/model/profile-interfaces';
import { Status } from '../global/status';

export type SignatureDocument = HydratedDocument<Signature>;

export type SignatureStatus =
  | Status.DRAFT
  | Status.READY
  | Status.CANCELED
  | Status.USED;

export interface PutSignatureDto {
  base64data: string;
  size: Size;
  id?: string;
}

@Schema()
export class Signature {
  @Expose()
  @Prop({ required: true, unique: true })
  id: string;

  @Expose()
  @Prop({ required: true })
  uid: string;

  @Expose()
  @Prop({ required: true })
  status: SignatureStatus;

  @Expose()
  @Prop({ required: true })
  created: Date;

  @Expose()
  @Prop()
  modified?: Date;

  @Expose()
  @Prop({ required: true })
  base64data: string;

  @Expose()
  @Prop({ type: Object })
  size: Size;
}

export const SignatureSchema = SchemaFactory.createForClass(Signature);
