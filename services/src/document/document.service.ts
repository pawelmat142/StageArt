import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IllegalStateException } from '../global/exceptions/illegal-state.exception';
import { Template } from './paper-util';
import { InjectModel } from '@nestjs/mongoose';
import { Paper } from './paper-model';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { BookingContext, SimpleBookingContext } from '../booking/model/interfaces';
import { BookingService } from '../booking/services/booking.service';
import { JwtPayload } from '../profile/auth/jwt-strategy';

@Injectable()
export class DocumentService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        @InjectModel(Paper.name) private paperModel: Model<Paper>,
        private readonly bookingService: BookingService,
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

}
