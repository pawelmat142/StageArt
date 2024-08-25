import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { IllegalStateException } from '../global/exceptions/illegal-state.exception';
import { Template } from './doc-util';
import Handlebars from 'handlebars';

@Injectable()
export class DocumentService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        private readonly httpService: HttpService
    ) {}


    public async generatePdfOfTemplate(template: Template, data: any): Promise<Buffer> {
        const html = this.getTemplate(template)
        const filledTemplate = this.fillTemplateData(html, data)
        const pdf = await this.generatePdf(filledTemplate)
        this.logger.log(`Generated PDF of template: ${template}`)
        return pdf
    }


    private async generatePdf(htmlContent: string): Promise<Buffer> {
        // Uruchomienie Puppeteer
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
    
        
        // Ustawienie zawartości strony HTML
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const cssPath = path.join(__dirname, 'templates', 'pdf-styles.css')
        await page.addStyleTag({ path: cssPath });
    
        // Generowanie PDF
        const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
        });
    
        await browser.close();
        return Buffer.from(pdfBuffer);
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
