import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Form, FormSchema } from './form.model';
import { FormController } from './form.controller';
import { FormService } from './form.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Form.name,
        schema: FormSchema,
      },
    ]),
  ],
  providers: [FormService],
  exports: [FormService],
  controllers: [FormController],
})
export class FormModule {}
