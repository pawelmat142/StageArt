import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Form } from "./form.model";
import { Model } from "mongoose";

@Injectable()
export class FormService {

    constructor(
        @InjectModel(Form.name) private formModel: Model<Form>,
    ) {}

    findForm(id: string) {
        return this.formModel.find({ id })
    }
}