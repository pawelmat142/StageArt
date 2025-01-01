import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IllegalStateException } from '../global/exceptions/illegal-state.exception';
import { PaperUtil, Template } from './paper-util';
import { InjectModel } from '@nestjs/mongoose';
import { Paper, PaperSignature } from './paper-model';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { BookingContext, SimpleBookingContext } from '../booking/model/interfaces';
import { BookingService } from '../booking/services/booking.service';
import { JwtPayload } from '../profile/auth/jwt-strategy';
import { PdfTemplate } from '../pdf/model/pdf-data';
import { ContractPaperDataProvider } from './generators/contract-paper-data-povider';
import { TechRiderDataProvider } from './generators/tech-rider-data.provider';
import { PdfGeneratorService } from '../pdf/pdf-generator.service';
import { PdfUtil } from '../pdf/pdf.util';
import { BookingUtil } from '../booking/util/booking.util';
import { SignatureService } from './signature.service';
import { PdfData } from '../pdf/model/pdf-data.model';

@Injectable()
export class DocumentService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        @InjectModel(Paper.name) private paperModel: Model<Paper>,
        private readonly bookingService: BookingService,
        private readonly contractPaperDataProvider: ContractPaperDataProvider,
        private readonly techRiderDataProvider: TechRiderDataProvider,
        private readonly pdfGeneratorService: PdfGeneratorService,
        private readonly signatureService: SignatureService,
    ) {}

    public fetchBookingPapers(formId: string) {
        return this.paperModel.find({ formId: formId }).select({
            content: false,
        }).exec()
    }

    public fetchPaper(id: string) {
        return this.paperModel.findOne({ id }).select({
            contentWithSignatures: false,
        }).exec()
    }

    public getPaper(id: string) {
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
        this.logger.log(`Paper saved: ${paper.template} with status: ${paper.status} by ${paper.uid}`)
        return paper
    }

    public async storeUploadPaper(fileObjectId: string, ctx: SimpleBookingContext, template: Template, extension: string) {
        const paper = new this.paperModel({
            id: uuidv4(),
            formId: ctx.booking.formId,
            template: template,
            fileObjectId: fileObjectId,
            extension: extension,
            uid: ctx.profile.uid,
            generationTime: new Date(),
            status: 'UPLOADED'
        })
        await paper.save()
        this.logger.log(`Paper saved: ${paper.template} with status: ${paper.status} by ${paper.uid}`)
        return paper
    }


    public async updatePaper(paper: Paper): Promise<Paper> {
        const update = await this.paperModel.updateOne({ id: paper.id }, { $set: paper })
        if (!update.modifiedCount) {
            throw new IllegalStateException(`Not updated Paper ${paper.id}`)
        }
        return paper
    }

    public async downloadPaper(id: string, profile: JwtPayload) {
        const paper = await this.paperModel.findOne({ id })
            .select({ contentWithSignatures: false })
            .exec()
        if (!paper) {
            throw new NotFoundException(`Paper ${id} not found`)
        }
        await this.bookingService.hasPermissionToBooking(paper.formId, profile.uid)
        this.logger.log(`Download paper: ${paper.template}, ${paper.id}`)
        return paper
    }

    public deletePaper(id: string) {
        return this.paperModel.deleteOne({ id })
    }

    public async downloadSignedPaper(id: string, profile: JwtPayload): Promise<Paper> {
        const paper = await this.paperModel.findOne({ id })
            .select({ content: false })
            .exec()
        if (!paper) {
            throw new NotFoundException(`Not found Paper ${id}`)
        }
        if (!paper.contentWithSignatures) {
            throw new NotFoundException(`Not found Paper with signatures ${id}`)
        }
        await this.bookingService.hasPermissionToBooking(paper.formId, profile.uid)
        return paper
    }

    public async generatePdf(formId: string, template: PdfTemplate, profile: JwtPayload): Promise<Paper> {
        this.logger.log(`Generate PDF ${template} for booking ${formId} by ${profile.uid}`)
        const ctx = await this.bookingService.buildContext(formId, profile)
        const data = await this.prepareData(ctx, template)

        // TODO get artist template
        const pdfData = PdfUtil.prepareDefaultPdfData(template)

        const buffer = await this.pdfGeneratorService.generate(template, pdfData, data)
        const paper = await this.storeBookingPaper(buffer, ctx, template)
        return paper
    }

    public async generateSignedPaper(paperId: string, signatureId: string, profile: JwtPayload): Promise<Paper> {
        const paper = await this.getPaper(paperId)
        if (!paper) {
            throw new NotFoundException(`Not found Paper ${paperId}`)
        }
        const template = paper.template as PdfTemplate
        const ctx = await this.bookingService.buildContext(paper.formId, profile)
        this.logger.log(`Generate Paper with signatures ${paper.template} for booking ${ctx.booking.formId} by ${ctx.profile.uid}`)
        
        let data = await this.prepareData(ctx, template)
        await this.updatePaperSignatures(paper, signatureId, ctx)
        PaperUtil.addSignaturesData(data, paper.signatures)

        const pdfData = await this.getPdfData(template, ctx)

        const buffer = await this.pdfGeneratorService.generate(template, pdfData, data)

        paper.contentWithSignatures = buffer
        await this.updatePaper(paper)

        return paper
    }

    private async getPdfData(template: PdfTemplate, ctx: BookingContext): Promise<PdfData> {
        // TODO find pdfData of artist
        const pdfData = PdfUtil.prepareDefaultPdfData(template)
        return pdfData
    }

    private prepareData(ctx: BookingContext, template: PdfTemplate): Promise<any> {
        if (template === 'contract') {
            return this.contractPaperDataProvider.prepareData(ctx)
        }
        if (template === 'tech-rider') {
            return this.techRiderDataProvider.prepareData(ctx)
        }
        throw new BadRequestException(`Not found data provider for template: ${template}`)
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
}
