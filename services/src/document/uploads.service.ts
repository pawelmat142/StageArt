import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { GridFSBucket, ObjectId } from 'mongodb';
import { Template } from "./paper-util";
import { JwtPayload } from "../profile/auth/jwt-strategy";
import { BookingService } from "../booking/services/booking.service";
import { DocumentService } from "./document.service";
import { Paper } from "./paper-model";
import * as mongoose from 'mongoose';
import * as fs from 'fs';
import * as Grid from 'gridfs-stream';


@Injectable()
export class UploadsService {

    private readonly logger = new Logger(this.constructor.name)

    private bucket: GridFSBucket;
    private grid: Grid;


    private readonly EPLOAD_EXTENSIONS: string[] = ['jpg', 'jpeg', 'pdf']
    public readonly MAX_FILE_BYTES = 1100

    constructor(
        @InjectConnection() private readonly connection: Connection,
        private readonly bookingService: BookingService,
        private readonly documentService: DocumentService,
    ) {
        this.grid = new Grid(this.connection.db, mongoose.mongo)
        this.bucket = new GridFSBucket(this.connection.db)
    }

    private readonly templatesForUpload: Template[] = ['rental-proof']


    public async uploadPaperFile(formId: string, template: Template, profile: JwtPayload, file: Express.Multer.File): Promise<Paper> {
        if (!this.templatesForUpload.includes(template)) {
            throw new BadRequestException(`Wrong template ${template} for upload`)
        }
        const ctx = await this.bookingService.buildSimpleContext(formId, profile)

        if (ctx.booking.promoterUid !== profile.uid) {
            this.logger.error(`Profile ${profile.uid} has no permission to Booking ${ctx.booking.formId}`)
            throw new UnauthorizedException()
        }
        
        const fileObjectId = await this.uploadPromise(file)
        if (!fileObjectId) {
            throw new BadRequestException(`Upload file error`)
        }
        const extension = file.mimetype.split('/').pop()
        if (!extension) {
            throw new BadRequestException(`Could not specify extension by mimetype: ${file.mimetype}`)
        }
        if (!this.EPLOAD_EXTENSIONS.includes(extension)) {
            throw new BadRequestException(`Wrong extension ${extension}`)
        }
        const paper = await this.documentService.storeUploadPaper(fileObjectId, ctx, template, extension)
        return paper
    }

    private async uploadPromise(file: Express.Multer.File): Promise<string> {   
        let buffer = fs.readFileSync(file.path);
        if (!buffer) {
            throw new BadRequestException(`Missing buffer`)
        }

        const uploadStream = this.bucket.openUploadStream(file.filename, { contentType: file.mimetype })
        uploadStream.write(buffer)
        uploadStream.end()

        return new Promise((resolve, reject) => {
            uploadStream.on('finish', () => resolve(uploadStream.id.toHexString()))
            uploadStream.on('error', (error) => reject('upload stream sww'))
        })
    }

    public async downloadFile(paperId: string, profile: JwtPayload) {
        const paper = await this.documentService.fetchPaper(paperId)
        if (!paper) {
            throw new NotFoundException(`Paper ${paperId} not found`)
        }
        await this.bookingService.hasPermissionToBooking(paper.formId, profile.uid)
        
        if (!paper.fileObjectId) {
            throw new NotFoundException(`Paper ${paperId} has no upload`)
        }
        const downloadStream = this.bucket.openDownloadStream(new ObjectId(paper.fileObjectId))
        return { paper, downloadStream }
    }

}