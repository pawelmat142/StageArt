import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { Template } from './doc-util';

// @Get('get-pdf/:id/:template')
// @UseGuards(JwtGuard)
// async getPdf(
//     @Res() res: Response,
//     @Param('id') formId: string,
//     @Param('template') template: Template,
//     @GetProfile() profile: JwtPayload
// ) {
//     const buffer = await this.bookingDocumentsService.getPdf(formId, template, profile)
//     res.set({
//         'Content-Type': 'application/pdf',
//         'Content-Disposition': `attachment; filename="${template}.pdf"`,
//         'Content-Length': buffer.length,
//     });

//     res.end(buffer);
// }


@Injectable()
export class DocumentService {

    private readonly logger = new Logger(this.constructor.name)

    constructor() {}


    public async getPdf(template: Template): Promise<Buffer> {
        const templateFileName = `${template}-template.html`
        const templatePath = path.join(__dirname, 'templates', templateFileName)
        let htmlContent = fs.readFileSync(templatePath, 'utf8');
        const pdf = await this.generatePdf(htmlContent)
        this.logger.log(`Generated pdf ${template}`)
        return pdf
    }


    async generatePdf(htmlContent: string): Promise<Buffer> {
        // Uruchomienie Puppeteer
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
    
        // Ustawienie zawartości strony HTML
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
        // Generowanie PDF
        const pdfBuffer = await page.pdf({
          format: 'A4',
          printBackground: true,
        });
    
        await browser.close();
        return Buffer.from(pdfBuffer);
    }
}
