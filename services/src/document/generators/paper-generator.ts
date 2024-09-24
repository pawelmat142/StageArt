import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { JwtPayload } from "../../profile/auth/jwt-strategy";
import { ContractPaperDataProvider } from "./contract-paper-data-povider";
import { BookingService } from "../../booking/services/booking.service";
import { BookingContext } from "../../booking/model/interfaces";
import { PaperGenerateParameters, PaperUtil, Template } from "../paper-util";
import Handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import * as path from 'path';
import * as fs from 'fs';
import { DocumentService } from "../document.service";
import { IllegalStateException } from "../../global/exceptions/illegal-state.exception";
import { TechRiderDataProvider } from "./tech-rider-data.provider";
import { Paper, PaperSignature } from "../paper-model";
import { Role } from "../../profile/model/role";
import { BookingUtil } from "../../booking/util/booking.util";
import { SignatureService } from "../signature.service";

@Injectable()
export class PaperGenerator {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        private readonly contractPaperDataProvider: ContractPaperDataProvider,
        private readonly techRiderDataProvider: TechRiderDataProvider,
        private readonly bookingService: BookingService,
        private readonly documentService: DocumentService,
        private readonly signatureService: SignatureService,
    ) {}


    public async generatePaper(formId: string, template: Template, profile: JwtPayload): Promise<Paper> {
        this.logger.log(`Generate Paper ${template} for booking ${formId} by ${profile.uid}`)
        const ctx = await this.bookingService.buildContext(formId, profile)
        const data = await this.prepareData(ctx, template)
        const buffer = await this.generateBuffer(template, data)
        const paper = await this.documentService.storeBookingPaper(buffer, ctx, template)
        return paper
    }

    async generateSignedPaper(paperId: string, signatureId: string, profile: JwtPayload): Promise<Paper> {
        const paper = await this.documentService.getPaper(paperId)
        if (!paper) {
            throw new NotFoundException(`Not found Paper ${paperId}`)
        }
        const ctx = await this.bookingService.buildContext(paper.formId, profile)
        this.logger.log(`Generate Paper with signatures ${paper.template} for booking ${ctx.booking.formId} by ${ctx.profile.uid}`)
        
        await this.updatePaperSignatures(paper, signatureId, ctx)
        
        let data = await this.prepareData(ctx, paper.template)
        this.addSignaturesData(data, paper.signatures)
        
        const buffer = await this.generateBuffer(paper.template, data)
        paper.contentWithSignatures = buffer
        await this.documentService.updatePaper(paper)

        return paper
    }

    private async updatePaperSignatures(paper: Paper, signatureId: string, ctx: BookingContext) {
        const bookingRoles = BookingUtil.bookingRoles(ctx.booking, ctx.profile.uid)
        if (!bookingRoles.length) {
            throw new UnauthorizedException(`Profile ${ctx.profile.uid} has no access to Booking ${ctx.booking.formId} -> Paper ${paper.formId}`)
        }

        const signature = await this.signatureService.fetch(signatureId, ctx.profile.uid)
        if (!signature?.base64data) {
            throw new NotFoundException(`Not found Signature ${signatureId}`)
        }

        const signatures: PaperSignature[] = paper.signatures || []

        bookingRoles.forEach(role => {
            const signatureToUpdate = signatures.find(s => s.role === role)
            if (signatureToUpdate) {
                signatureToUpdate.base64 = signature.base64data
            } else {
                signatures.push({ base64: signature.base64data, role: role})
            }
            this.logger.log(`Added Signature ${signatureId} of role: ${role} to Paper ${paper.id}`)
        })

        paper.signatures = signatures
    }



    private async addSignaturesData(data: any, paperSignatures: PaperSignature[]) {
        if (!paperSignatures.length) {
            throw new BadRequestException(`Signatures missing`)
        }
        paperSignatures.forEach(signature => {
            if (signature.role === Role.PROMOTER) {
                data.promoterSignature = signature.base64
            }
            if (signature.role === Role.MANAGER) {
                data.managerSignature = signature.base64
            }
            if (signature.role === Role.ARTIST) {
                data.artistSignature = signature.base64
            }
        })
    }


    private prepareData(ctx: BookingContext, template: Template): Promise<any> {
        if (template === 'contract') {
            return this.contractPaperDataProvider.prepareData(ctx)
        }
        if (template === 'tech-rider') {
            return this.techRiderDataProvider.prepareData(ctx)
        }
        throw new BadRequestException(`Not found data provider for template: ${template}`)
    }


    public async generateBuffer(template: Template, data: any): Promise<Buffer> {
        const html = this.getTemplate(template)
        const filledTemplate = this.fillTemplateData(html, data)
    
        const params = PaperUtil.preparePaperGenerateParams(data)

        const buffer = await this.generate(filledTemplate, params)
        this.logger.log(`Generated PDF of template: ${template}`)
        return buffer
    }

    private getTemplate(template: Template): string {
        const templateFileName = `${template}-template.html`
        const templatePath = this.templateDirPath(templateFileName)
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

    private async generate(htmlContent: string, params?: PaperGenerateParameters): Promise<Buffer> {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        await this.addCssStyles(page)

        // Generowanie PDF
        const uint8Array = await page.pdf({
          format: 'A4',
          displayHeaderFooter: !!params?.displayHeaderFooter,
          headerTemplate: params?.displayHeaderFooter ? params.headerTemplate : undefined,
          footerTemplate: params?.displayHeaderFooter ? params.footerTemplate : undefined,
          printBackground: false,
        })

        await browser.close();
        return Buffer.from(uint8Array);
    }

    
    private async addCssStyles(puppeteerPage: puppeteer.Page) {
        const cssPath = this.templateDirPath('pdf-styles.css')
        await puppeteerPage.addStyleTag({ path: cssPath });
    }

    private templateDirPath(filename: string) {
        return path.join(__dirname, '..', 'templates', filename)
    }
}
