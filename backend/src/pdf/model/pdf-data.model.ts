import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PdfSection, PdfTemplate } from './pdf-data';

export type PdfDataDocument = HydratedDocument<PdfData>;

@Schema()
export class PdfData {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  active: boolean;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  template: PdfTemplate;

  @Prop({ required: true })
  created: Date;

  @Prop({ required: true })
  modified: Date;

  @Prop({ required: true })
  header: string;

  @Prop({ required: true })
  sections: PdfSection[];

  @Prop({ required: true })
  artistSignature?: string;

  @Prop({ required: true })
  managerUid?: string;
}

export const PdfDataSchema = SchemaFactory.createForClass(PdfData);
