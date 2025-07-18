import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Form } from './form.model';
import { Model } from 'mongoose';

@Injectable()
export class FormService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(@InjectModel(Form.name) private formModel: Model<Form>) {}

  findForm(id: string): Promise<Form> {
    return this.formModel.findOne({ id });
  }

  async startForm(formType: string, data: any) {
    const formId = this.generateFormId(formType);
    const form = new this.formModel({
      id: formId,
      formType: formType,
      formStatus: 'PROGRESS',
      data: data,
      created: new Date(),
      modified: new Date(),
    });

    const saved = await form.save();
    this.logger.log(`Started form ${formId}`);
    return { formId };
  }

  async submitForm(id: string) {
    const update = await this.formModel.updateOne(
      { id },
      { $set: { formStatus: 'SUBMITTED' } },
    );
    if (!update.modifiedCount) {
      this.logger.warn(`Not found form to submit: ${id}`);
    }
  }

  public generateFormId(formType: string): string {
    return `${formType.replace(' ', '_')}-${Date.now().toString().slice(-4)}`;
  }
}
