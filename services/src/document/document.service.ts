import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';
import { IllegalStateException } from '../global/exceptions/illegal-state.exception';
import { DocUtil, Template } from './doc-util';
import Handlebars from 'handlebars';

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
    ) {}

    public async generatePdf(template: Template, data: any, options?: DocumentGenerateOptions): Promise<Buffer> {
        const html = this.getTemplate(template)
        const filledTemplate = this.fillTemplateData(html, data)
        if (options?.addSignature && data.signature && typeof data.signature === 'string') {
            DocUtil.addSignatureFooterToEveryPage(options, data.signature as string)
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

}
