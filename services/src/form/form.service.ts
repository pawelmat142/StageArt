import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Form } from "./form.model";
import { Model } from "mongoose";

@Injectable()
export class FormService {

    constructor(
        @InjectModel(Form.name) private formModel: Model<Form>,
    ) {}

    findForm(id: string): Promise<Form> {
        return this.formModel.findOne({ id })
    }

    async submitForm(id: string) {
        const update = await this.formModel.updateOne({ id }, { $set: { formStatus: 'SUBMITTED' }})
        if (!update.modifiedCount) {
            throw new NotFoundException(`Not found form to submit: ${id}`)
        }
    }
}