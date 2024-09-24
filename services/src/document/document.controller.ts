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
import { ChecklistService } from './checklist.service';
import { PutSignatureDto, Signature } from './signature.model';
import { SignatureService } from './signature.service';
import { PaperGenerator } from './generators/paper-generator';

@Controller('api/document')
@UseInterceptors(LogInterceptor)
@UseGuards(JwtGuard)
export class DocumentController {

    constructor(
        private readonly documentService: DocumentService,
        private readonly checklistService: ChecklistService,
        private readonly signatureService: SignatureService,
        private readonly paperGenerator: PaperGenerator,
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
        @GetProfile() profile: JwtPayload
    ) {
        const paper = await this.documentService.downloadPaper(id, profile)
        if (!paper) {
            throw new NotFoundException()
        }
        this.pdfResponse(res, paper.content, `${paper.template}.${paper.extension}`)
    }

    @Get('/generate/:id/:template')
    async generate(
        @Res() res: Response,
        @Param('id') formId: string,
        @Param('template') template: Template,
        @GetProfile() profile: JwtPayload
    ) {
        const paper = await this.paperGenerator.generatePaper(formId, template, profile)
        this.pdfResponse(res, paper.content, `${paper.template}.${paper.extension}`)
    }

    @Get('/sign/:paperid/:signatureid')
    async signPaper(
        @Res() res: Response,
        @Param('paperid') paperId: string,
        @Param('signatureid') signatureId: string,
        @GetProfile() profile: JwtPayload
    ) {
        const paper = await this.paperGenerator.generateSignedPaper(paperId, signatureId, profile)
        this.pdfResponse(res, paper.contentWithSignatures, `${paper.template}-signed.${paper.extension}`)
    }

    @Get('/download-signed/:id')
    @Serialize(Paper)
    async downloadSignedPaper(
        @Res() res: Response,
        @Param('id') id: string,
        @GetProfile() profile: JwtPayload
    ) {
        const paper = await this.documentService.downloadSignedPaper(id, profile)
        this.pdfResponse(res, paper.contentWithSignatures, `${paper.template}-signed.${paper.extension}`)
    }


    private pdfResponse(res: Response, buffer: Buffer, filename: string) {
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Content-Length': buffer.length,
        });
        res.end(buffer);
    }


    // SIGNATURES
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