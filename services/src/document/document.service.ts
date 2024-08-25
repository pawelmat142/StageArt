import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as path from 'path';

@Injectable()
export class DocumentService {

    private readonly logger = new Logger(this.constructor.name)

    constructor() {}


    public async getPdf(html: string): Promise<Buffer> {
        const pdf = await this.generatePdf(html)
        this.logger.log(`Generated pdf`)
        return pdf
    }


    async generatePdf(htmlContent: string): Promise<Buffer> {
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
}
