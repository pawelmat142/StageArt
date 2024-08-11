import { Body, Controller, Get, Logger, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Form } from './form.model';
import { Model } from 'mongoose';
import { NotModifiedException } from '../global/exceptions/not-modified.exception';

@Controller('api/form')
export class FormController {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        @InjectModel(Form.name) private formModel: Model<Form>,
    ) {}

    @Get('/submitted/:formType')
    fetchSubmitted(@Param('formType') formType: string) {
        return this.formModel.find({ formType, formStatus: 'SUBMITTED' })
    }

    @Get('/open/:id')
    async openForm(@Param('id') id: string) {
        const form = await this.formModel.findOne({ id })
        if (!form) {
            throw new NotFoundException(`Not found booking form with id ${id}`)
        }
        this.logger.log(`Opening form with id: ${id}`)
        return form
    }

    @Post('/start/:formType')
    async startForm(@Param('formType') formType: string, @Body() data: any) {
        const id = this.generateBookingId(formType)
        const form = new this.formModel({
            id: id,
            formType: formType,
            formStatus: 'PROGRESS',
            data: data,
            created: new Date(),
            modified: new Date()
        })

        const saved = await form.save()
        this.logger.log(`Started form ${id}`)
        return { id: id }
    }

    @Put('/store/:id') 
    async storeForm(@Param('id') id: string, @Body() data: any) {
        const update = await this.formModel.updateOne({ id: id }, { $set: { 
            data: data,
            modified: new Date()
        } })
        if (!update.modifiedCount) {
            throw new NotModifiedException()
        }
        if (!update.matchedCount) {
            throw new NotFoundException(`Not found form with id: ${id}`)
        }
        this.logger.log(`Stored form with id ${id}`)
    }

    @Put('/submit/:id') 
    async submitForm(@Param('id') id: string, @Body() data: any) {
        const update = await this.formModel.updateOne({ id: id }, { $set: { 
            data: data,
            modified: new Date(),
            formStatus: 'SUBMITTED'
        } })
        if (!update.modifiedCount) {
            throw new NotModifiedException()
        }
        if (!update.matchedCount) {
            throw new NotFoundException(`Not found form with id: ${id}`)
        }
        this.logger.log(`Submitted form with id ${id}`)
    }


    private generateBookingId(formType: string): string {
        return `${formType.replace(' ', '_')}-${Date.now().toString().slice(-4)}`
    }
    
}
