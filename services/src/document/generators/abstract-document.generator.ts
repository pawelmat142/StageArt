import { Injectable } from "@nestjs/common";
import { DocumentService } from "../document.service";
import { Template } from "../doc-util"
import { FormUtil } from "../../form/form.util";

export interface AbstractDocumentInterface {
    template: Template
}

@Injectable()
export abstract class AbstractDocumentGenerator<T> {

    constructor(
        protected readonly documentService: DocumentService,
    ) {}
    
    protected get template(): Template {
        throw new Error('Not implemented')
    }
    
    protected async prepareData(ctx: any): Promise<T> {
        throw new Error("not implemented")
    }

    public async generate(ctx: any): Promise<Buffer> {
        const data = await this.prepareData(ctx)
        const pdf = await this.documentService.generatePdfOfTemplate(this.template, data)
        return pdf
    }


    protected get(formData: any, path: string): any {
        return FormUtil.get(formData, path)
    }

}