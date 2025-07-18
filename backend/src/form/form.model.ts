import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FormDocument = HydratedDocument<Form>;

export type FormStatus = 'PROGRESS' | 'SUBMITTED' | 'COMPLETED' | 'REJECTED';

@Schema()
export class Form {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  formType: string;

  @Prop()
  formStatus: FormStatus;

  @Prop({ type: Object })
  data: any;

  @Prop()
  created: Date;

  @Prop()
  modified: Date;
}

export const FormSchema = SchemaFactory.createForClass(Form);
