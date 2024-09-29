import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
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
import { PaperGenerator } from './generators/paper-generator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';

@Controller('api/document')
@UseInterceptors(LogInterceptor)
@UseGuards(JwtGuard)
export class DocumentController {

    constructor(
        private readonly documentService: DocumentService,
        private readonly checklistService: ChecklistService,
        private readonly signatureService: SignatureService,
        private readonly paperGenerator: PaperGenerator,
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
        this.fileResponse(res, paper.content, `${paper.template}.${paper.extension}`)
    }

    @Get('/generate/:id/:template')
    async generate(
        @Res() res: Response,
        @Param('id') formId: string,
        @Param('template') template: Template,
        @GetProfile() profile: JwtPayload
    ) {
        const paper = await this.paperGenerator.generatePaper(formId, template, profile)
        this.fileResponse(res, paper.content, `${paper.template}.${paper.extension}`)
    }

    @Get('/sign/:paperid/:signatureid')
    async signPaper(
        @Res() res: Response,
        @Param('paperid') paperId: string,
        @Param('signatureid') signatureId: string,
        @GetProfile() profile: JwtPayload
    ) {
        const paper = await this.paperGenerator.generateSignedPaper(paperId, signatureId, profile)
        this.fileResponse(res, paper.contentWithSignatures, `${paper.template}-signed.${paper.extension}`)
    }

    @Get('/download-signed/:id')
    @Serialize(Paper)
    async downloadSignedPaper(
        @Res() res: Response,
        @Param('id') id: string,
        @GetProfile() profile: JwtPayload
    ) {
        const paper = await this.documentService.downloadSignedPaper(id, profile)
        this.fileResponse(res, paper.contentWithSignatures, `${paper.template}-signed.${paper.extension}`)
    }

    @Delete('/:id')
    @UseGuards(JwtGuard)
    deletePaper(
        @Param('id') id: string,
        @GetProfile() profile: JwtPayload
    ) {
        return this.uploadsService.deletePaper(id, profile)
    }


    // UPLOADS
    @Post('/upload/:id/:template')
    @UseGuards(JwtGuard)
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @Param('id') formId: string,
        @Param('template') template: Template,
        @GetProfile() profile: JwtPayload,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (file.size > this.uploadsService.MAX_FILE_BYTES) {
            throw new BadRequestException(`Max file size 1 MB`)
        }
        return this.uploadsService.uploadPaperFile(formId, template, profile, file)
    }

    @Get('/upload/:paperId')
    @UseGuards(JwtGuard)
    public async downloadFile(
        @Param('paperId') paperId: string, 
        @Res() res: Response, 
        @GetProfile() profile: JwtPayload
    ) {
        const { paper, downloadStream } = await this.uploadsService.downloadFile(paperId, profile)
        const filename = `${paper.template}.${paper.extension}`
        res.set({
            'Content-Type': PaperUtil.getContentType(filename),
            'Content-Disposition': `attachment; filename="${filename}"`,
        })
        downloadStream.pipe(res)
    }


    private fileResponse(res: Response, buffer: Buffer, filename: string) {
        res.set({
            'Content-Type': PaperUtil.getContentType(filename),
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