import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { PdfTemplate } from './model/pdf-data';
import * as puppeteer from 'puppeteer';
import * as Handlebars from 'handlebars';
import { defaultContractPdf } from './model/default-contract.pdf';
import { PdfUtil } from './pdf.util';
import { PaperGenerateParameters } from '../document/paper-util';
import { PdfData } from './model/pdf-data.model';

@Injectable()
export class PdfGeneratorService implements OnModuleInit {
  private readonly logger = new Logger(this.constructor.name);

  onModuleInit() {
    this.registerCompiler();
  }

  public async test(): Promise<Buffer> {
    const pdfData = defaultContractPdf;

    const plainTemplate = this.preparePlainTemplate(pdfData);

    const html = this.filTemplateWithData(plainTemplate, pdfData);

    return this._generate(html);
  }

  public async generate(
    template: PdfTemplate,
    pdfData?: PdfData,
    data?: any,
  ): Promise<Buffer> {
    this.logger.log(`Generate PDF ${template}`);

    const _pdfData = this.preparePdfData(template, pdfData);

    const plainTemplate = this.preparePlainTemplate(_pdfData);

    const html = this.filTemplateWithData(plainTemplate, { data: data });

    const params = PdfUtil.preparePaperGenerateParams(data); //adds signatures

    return this._generate(html, params);
  }

  private preparePdfData(template: PdfTemplate, pdfData?: PdfData): PdfData {
    return pdfData ?? PdfUtil.prepareDefaultPdfData(template);
  }

  public static selectDefaultPdfDate;

  private async _generate(
    html: string,
    params?: PaperGenerateParameters,
  ): Promise<Buffer> {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await this.addCssStyles(page);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      displayHeaderFooter: !!params?.displayHeaderFooter,
      headerTemplate: params?.displayHeaderFooter
        ? params.headerTemplate
        : undefined,
      footerTemplate: params?.displayHeaderFooter
        ? params.footerTemplate
        : undefined,
      printBackground: false,
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  }

  private preparePlainTemplate(data: PdfData): string {
    const filePath = this.templateDirPath(`template.hbs`);
    const plainTemplate = fs.readFileSync(filePath, 'utf-8');
    return this.filTemplateWithData(plainTemplate, data);
  }

  private filTemplateWithData(template: string, data: any): string {
    const templateToFill = Handlebars.compile(template);
    return templateToFill(data);
  }

  private registerCompiler() {
    Handlebars.registerHelper('compile', function (template, options) {
      const compiledTemplate = Handlebars.compile(template);
      return compiledTemplate(options.data.root);
    });
    this.logger.log(`Handlebar compiler registered`);
  }

  private async addCssStyles(puppeteerPage: puppeteer.Page) {
    const cssPath = this.templateDirPath('pdf-styles.css');
    await puppeteerPage.addStyleTag({ path: cssPath });
  }

  private templateDirPath(filename: string) {
    return path.join(__dirname, 'templates', filename);
  }
}
