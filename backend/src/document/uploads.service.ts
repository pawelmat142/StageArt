import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Template } from "./paper-util";
import { JwtPayload } from "../profile/auth/jwt-strategy";
import { BookingService } from "../booking/services/booking.service";
import { DocumentService } from "./document.service";
import { Paper } from "./paper-model";
import { MessageException } from "../global/exceptions/message-exception";

/*
    Management of documents/Papers from uploading
    Mongo file storage 
*/
@Injectable()
export class UploadsService {

    private readonly logger = new Logger(this.constructor.name)

    private readonly UPLOAD_EXTENSIONS: string[] = ['jpg', 'jpeg', 'pdf']
    private readonly UPLOAD_TEMPLATES: Template[] = ['rental-proof']
    private readonly MAX_FILE_BYTES = 1100000

    constructor(
        private readonly bookingService: BookingService,
        private readonly documentService: DocumentService,
    ) {}

    public async uploadPaperFile(formId: string, template: Template, profile: JwtPayload, file: Express.Multer.File): Promise<Paper> {
        this.logger.log(`[START] Upload file ${file.originalname}, Template: ${template}, by: ${profile.uid}, Booking: ${formId}`)
        const extension = this.validateUploadFile(file, template)

        const ctx = await this.bookingService.buildSimpleContext(formId, profile)

        if (ctx.booking.promoterUid !== profile.uid) {
            throw new UnauthorizedException(`Profile ${profile.uid} has no permission to Booking ${ctx.booking.formId}`)
        }
        
        const paper = await this.documentService.storeUploadPaper(file.buffer, ctx, template, extension)
        this.logger.log(`[STOP] Upload file ${file.originalname}, Template: ${template}, by: ${profile.uid}, Booking: ${formId}`)
        return paper
    }

    private validateUploadFile(file: Express.Multer.File, template: Template): string {
        if (!file.buffer) {
            throw new BadRequestException(`No buffer when upload file`)
        }
        if (file.size > this.MAX_FILE_BYTES) {
            throw new MessageException(`Max file size 1 MB`)
        }
        if (!this.UPLOAD_TEMPLATES.includes(template)) {
            throw new BadRequestException(`Wrong template ${template} for upload`)
        }
        const extension = file.mimetype.split('/').pop()
        if (!extension) {
            throw new MessageException(`Could not specify extension, mimetype: ${file.mimetype}`)
        }
        if (!this.UPLOAD_EXTENSIONS.includes(extension)) {
            throw new MessageException(`Wrong extension ${extension}`)
        }
        return extension
    }

    public async verifyPaperFile(paperId: string, profile: JwtPayload): Promise<void> {
        const paper = await this.documentService.getPaper(paperId)
        if (!paper) {
            throw new NotFoundException(`Not found Paper with id ${paperId}`)
        }
        await this.bookingService.hasPermissionToBooking(paper.formId, profile.uid)
        paper.status = 'VERIFIED'
        await this.documentService.updatePaper(paper)
        this.logger.log(`Verified Paper ${paper.id}, by ${profile.uid}`)
    }


    public async downloadFile(paperId: string, profile: JwtPayload): Promise<Paper> {
        const paper = await this.documentService.fetchPaper(paperId)
        if (!paper) {
            throw new NotFoundException(`Paper ${paperId} not found`)
        }
        await this.bookingService.hasPermissionToBooking(paper.formId, profile.uid)
        return paper
    }

    public async deletePaper(id: string, profile: JwtPayload): Promise<{ deleted: boolean }> {
        const paper = await this.documentService.fetchPaper(id)
        if (!paper) {
            throw new NotFoundException(`Paper ${id} not found`)
        }
        await this.bookingService.hasPermissionToBooking(paper.formId, profile.uid)

        const update = await this.documentService.deletePaperItem(id)
        if (update.deletedCount) {
            this.logger.log(`Deleter Paper ${paper.id}`)
        } else {
            this.logger.warn(`Counld not delete Paper ${paper.id}`)
        }
        return { deleted: !!update.deletedCount }
    }

}