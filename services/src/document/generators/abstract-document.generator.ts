import { Injectable } from "@nestjs/common";
import { DocumentGenerateOptions, DocumentService } from "../document.service";
import { Template } from "../paper-util"
import { FormUtil } from "../../form/form.util";
import { Paper } from "../paper-model";

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

    public async generatePdf(ctx: any, options?: DocumentGenerateOptions): Promise<Paper> {
        const data = await this.prepareData(ctx, options)
        const pdfBuffer = await this.documentService.generatePdf(this.template, data, options)
        const paper = await this.documentService.storeBookingPaper(pdfBuffer, ctx, this.template)
        return paper
    }

    protected get(formData: any, path: string): any {
        return FormUtil.get(formData, path)
    }

}