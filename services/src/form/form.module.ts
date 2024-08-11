import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Form, FormSchema } from './form.model';
import { FormController } from './form.controller';

@Module({
    imports: [
        MongooseModule.forFeature([{
          name: Form.name,
          schema: FormSchema
        }]),
      ],
    controllers: [FormController],
})
export class FormModule {}
