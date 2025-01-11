import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtGuard } from '../profile/auth/jwt.guard';
import { Serialize } from '../global/interceptors/serialize.interceptor';
import { LogInterceptor } from '../global/interceptors/log.interceptor';
import { Paper } from './paper-model';
import { DocumentService } from './document.service';
import { Response } from 'express';
import { GetProfile } from '../profile/auth/profile-path-param-getter';
import { PaperUtil, Template } from './paper-util';
import { JwtPayload } from '../profile/auth/jwt-strategy';
import { ChecklistService } from './checklist.service';
import { PutSignatureDto, Signature } from './signature.model';
import { SignatureService } from './signature.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { PdfTemplate } from '../pdf/model/pdf-data';
import { RoleGuard } from '../profile/auth/role.guard';
import { Role } from '../profile/model/role';
import { memoryStorage } from 'multer';

@Controller('api/document')
@UseInterceptors(LogInterceptor)
@UseGuards(JwtGuard)
export class DocumentController {

    constructor(
        private readonly documentService: DocumentService,
        private readonly checklistService: ChecklistService,
        private readonly signatureService: SignatureService,
        private readonly uploadsService: UploadsService,
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
        PaperUtil.fileResponse(res, paper.content, `${paper.template}.${paper.extension}`)
    }

    @Get('/generate/:id/:template')
    async generate(
        @Res() res: Response,
        @Param('id') formId: string,
        @Param('template') template: PdfTemplate,
        @GetProfile() profile: JwtPayload
    ) {
        const paper = await this.documentService.generatePdf(formId, template, profile)
        PaperUtil.fileResponse(res, paper.content, `${paper.template}.${paper.extension}`)
    }

    @Get('/sign/:paperid/:signatureid')
    async signPaper(
        @Res() res: Response,
        @Param('paperid') paperId: string,
        @Param('signatureid') signatureId: string,
        @GetProfile() profile: JwtPayload
    ) {
        const paper = await this.documentService.generateSignedPaper(paperId, signatureId, profile)
        PaperUtil.fileResponse(res, paper.contentWithSignatures, `${paper.template}-signed.${paper.extension}`)
    }

    @Get('/download-signed/:id')
    @Serialize(Paper)
    async downloadSignedPaper(
        @Res() res: Response,
        @Param('id') id: string,
        @GetProfile() profile: JwtPayload
    ) {
        const paper = await this.documentService.downloadSignedPaper(id, profile)
        PaperUtil.fileResponse(res, paper.contentWithSignatures, `${paper.template}-signed.${paper.extension}`)
    }

    @Delete('/:id')
    @UseGuards(JwtGuard)
    deletePaper(
        @Param('id') id: string,
        @GetProfile() profile: JwtPayload
    ) {
        return this.uploadsService.deletePaper(id, profile)
    }

    @Post('upload/:id/:template')
    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: memoryStorage(), 
    }))
    async uploadFile(
        @Param('id') formId: string,
        @Param('template') template: Template,
        @GetProfile() profile: JwtPayload,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return this.uploadsService.uploadPaperFile(formId, template, profile, file)
    }


    @UseGuards(RoleGuard(Role.MANAGER))
    @Post('/verify/:paperId')
    verifyPaperFile(@Param('paperId') paperId: string, @GetProfile() profile: JwtPayload ) {
        this.uploadsService.verifyPaperFile(paperId, profile)
    }

    @Get('/upload/:paperId')
    @UseGuards(JwtGuard)
    public async downloadFile(
        @Param('paperId') paperId: string, 
        @Res() res: Response, 
        @GetProfile() profile: JwtPayload
    ) {
        const paper = await this.uploadsService.downloadFile(paperId, profile)
        PaperUtil.fileResponse(res, paper.content, `${paper.template}.${paper.extension}`)
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