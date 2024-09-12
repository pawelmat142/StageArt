import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';
import { IllegalStateException } from '../global/exceptions/illegal-state.exception';
import { PaperUtil, Template } from './paper-util';
import Handlebars from 'handlebars';
import { InjectModel } from '@nestjs/mongoose';
import { Paper } from './paper-model';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { BookingContext } from '../booking/model/interfaces';

export interface DocumentGenerateOptions {
    addSignature?: boolean
    headerTemplate?: string
    footerTemplate?: string,
    displayHeaderFooter?: boolean,
}

@Injectable()
export class DocumentService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        @InjectModel(Paper.name) private paperModel: Model<Paper>,
    ) {}

    public fetchBookingPapers(formId: string) {
        return this.paperModel.find({ formId: formId }).select({
            content: false
        }).exec()
    }

    public fetchPaper(id: string) {
        return this.paperModel.findOne({ id }).exec()
    }

    public async storeBookingPaper(buffer: Buffer, ctx: BookingContext, template: Template): Promise<Paper> {
        const paper = new this.paperModel({
            id: uuidv4(),
            formId: ctx.booking.formId,
            template: template,
            content: buffer,
            extension: 'pdf',
            uid: ctx.profile.uid,
            generationTime: new Date(),
            status: 'GENERATED'
        })
        await paper.save()
        this.logger.log(`Saved paper: ${paper.template} with status: ${paper.status} by ${paper.uid}`)
        return paper
    }

    public async downloadPaper(id: string) {
        const paper = await this.paperModel.findOne({ id })
        if (!paper) {
            throw new NotFoundException(`Paper ${id} not found`)
        }
        this.logger.log(`Download paper: ${paper.template}, ${paper.id}`)
        return paper
    }


    public async generatePdf(template: Template, data: any, options?: DocumentGenerateOptions): Promise<Buffer> {
        const html = this.getTemplate(template)
        const filledTemplate = this.fillTemplateData(html, data)
        if (options?.addSignature && data.signature && typeof data.signature === 'string') {
            PaperUtil.addSignatureFooterToEveryPage(options, data.signature as string)
        }
        const pdf = await this.generate(filledTemplate, options)
        this.logger.log(`Generated PDF of template: ${template}`)
        return pdf
    }

    private async generate(htmlContent: string, options?: DocumentGenerateOptions): Promise<Buffer> {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        await this.addCssStyles(page)

        // Generowanie PDF
        const pdfBuffer = await page.pdf({
          format: 'A4',
          headerTemplate: options?.headerTemplate || undefined,
          footerTemplate: options?.footerTemplate || undefined,
          displayHeaderFooter: options?.displayHeaderFooter || false,
          printBackground: false,
        });

        await browser.close();
        return Buffer.from(pdfBuffer);
    }

    private async addCssStyles(puppeteerPage: puppeteer.Page) {
        const cssPath = path.join(__dirname, 'templates', 'pdf-styles.css')
        await puppeteerPage.addStyleTag({ path: cssPath });
    }

    private getTemplate(template: Template): string {
        const templateFileName = `${template}-template.html`
        const templatePath = path.join(__dirname, 'templates', templateFileName)
        let htmlTemplate = fs.readFileSync(templatePath, 'utf8');
        if (!template) {
            throw new IllegalStateException(`Template loading error`)
        }
        return htmlTemplate
    }

    private fillTemplateData(template: string, data: any): string {
        const templateToFill = Handlebars.compile(template);
        const filledTemplate = templateToFill(data)
        return filledTemplate
    }



    // public async signContract(formId: string, profile: JwtPayload) {
    //     const ctx = await this.bookingService.buildContext(formId, profile)
    //     // TODO store signed document!!
    //     // TODO delete signed document option
    //     // TODO option to upload signed document
    //     return this.bookingContractDocument.generatePdf(ctx, { addSignature: true })
    // }

}
