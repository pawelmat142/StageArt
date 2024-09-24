import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtGuard } from '../profile/auth/jwt.guard';
import { Serialize } from '../global/interceptors/serialize.interceptor';
import { LogInterceptor } from '../global/interceptors/log.interceptor';
import { Paper } from './paper-model';
import { DocumentService } from './document.service';
import { Response } from 'express';
import { GetProfile } from '../profile/auth/profile-path-param-getter';
import { Template } from './paper-util';
import { JwtPayload } from '../profile/auth/jwt-strategy';
import { BookingContractDocumentGenerator } from './generators/booking-contract.generator';
import { TechRiderDocumentGenerator } from './generators/tech-rider.generator';
import { BookingService } from '../booking/services/booking.service';
import { ChecklistService } from './checklist.service';
import { PutSignatureDto, Signature } from './signature.model';
import { SignatureService } from './signature.service';

@Controller('api/document')
@UseInterceptors(LogInterceptor)
@UseGuards(JwtGuard)
export class DocumentController {

    constructor(
        private readonly documentService: DocumentService,
        private readonly bookingContractDocument: BookingContractDocumentGenerator,
        private readonly techRiderDocument: TechRiderDocumentGenerator,
        private readonly bookingService: BookingService,
        private readonly checklistService: ChecklistService,
        private readonly signatureService: SignatureService,
    ) {}

    @Get('/refresh-checklist/:id')
    refreshChecklist(@Param('id') formId: string, @GetProfile() profile: JwtPayload) {
        return this.checklistService.refreshChecklist(formId, profile)
    }

    @Get('/download/:id')
    @Serialize(Paper)
    async downloadPaper(
        @Res() res: Response,
        @Param('id') id: string,
    ) {
        const paper = await this.documentService.fetchPaper(id)
        if (!paper) {
            throw new NotFoundException()
        }
        this.pdfResponse(res, paper)
    }

    @Get('/generate/:id/:template')
    async generate(
        @Res() res: Response,
        @Param('id') formId: string,
        @Param('template') template: Template,
        @GetProfile() profile: JwtPayload
    ) {
        const paper = await this.generatePaper(formId, template, profile)
        this.pdfResponse(res, paper)
    }

    @Get('/sign/:paperid/:signatureid')
    async signPaper(
        @Res() res: Response,
        @Param('paperid') paperId: string,
        @Param('signatureid') signatureId: string,
        @GetProfile() profile: JwtPayload
    ) {
        const paper = await this.documentService.signPaper(paperId, signatureId, profile)
        this.pdfResponse(res, paper)
    }


    private pdfResponse(res: Response, paper: Paper) {
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${paper.template}.${paper.extension}"`,
            'Content-Length': paper.content.length,
        });
        res.end(paper.content);
    }


    private async generatePaper(formId: string, templateName: Template, profile: JwtPayload): Promise<Paper> {
        const ctx = await this.bookingService.buildContext(formId, profile)
        if (templateName === 'contract') {
            const paper = await this.bookingContractDocument.generatePdf(ctx)
            return paper
        }
        if (templateName === 'tech-rider') {
            return this.techRiderDocument.generatePdf(ctx)
        }
        throw new BadRequestException(`Unsupported template ${templateName}`)
    }


    @Get('/signatures')
    @Serialize(Signature)
    listSignatures(@GetProfile() profile: JwtPayload) {
        return this.signatureService.listSignatures(profile.uid)
    }

    @Put('/signature')
    putSignature(@Body() dto: PutSignatureDto, @GetProfile() profile: JwtPayload) {
        return this.signatureService.putSignature(dto, profile)
    }

    @Delete('/signature/:id')
    @UseGuards(JwtGuard)
    cancelSignature(@Param('id') id: string, @GetProfile() profile: JwtPayload) {
        return this.signatureService.cancelSignature(id, profile.uid)
    }

}