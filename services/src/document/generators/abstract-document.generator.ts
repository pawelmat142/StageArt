import { Injectable } from "@nestjs/common";
import { DocumentGenerateOptions, DocumentService } from "../document.service";
import { Template } from "../doc-util"
import { FormUtil } from "../../form/form.util";

@Injectable()
export abstract class AbstractDocumentGenerator<T> {

    constructor(
        protected readonly documentService: DocumentService,
    ) {}
    
    protected get template(): Template {
        throw new Error('Not implemented')
    }
    
    protected async prepareData(ctx: any, options?: DocumentGenerateOptions): Promise<T> {
        throw new Error("not implemented")
    }

    public async generate(ctx: any, options?: DocumentGenerateOptions): Promise<Buffer> {
        const data = await this.prepareData(ctx, options)
        const pdf = await this.documentService.generatePdf(this.template, data, options)
        return pdf
    }

    protected get(formData: any, path: string): any {
        return FormUtil.get(formData, path)
    }

}