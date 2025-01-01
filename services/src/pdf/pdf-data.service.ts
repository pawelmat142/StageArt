import { Injectable, Logger } from '@nestjs/common';
import { PdfDataDto, PdfTemplate } from './model/pdf-data';
import { InjectModel } from '@nestjs/mongoose';
import { PdfData } from './model/pdf-data.model';
import { PdfUtil } from './pdf.util';
import { Model } from 'mongoose';
import { JwtPayload } from '../profile/auth/jwt-strategy';
import { v4 as uuidv4 } from 'uuid';
import { IllegalStateException } from '../global/exceptions/illegal-state.exception';

@Injectable()
export class PdfDataService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        @InjectModel(PdfData.name) private pdfDataModel: Model<PdfData>,
    ) {}


    public getDefaultPdfData(tempalte: PdfTemplate): PdfData {
        return PdfUtil.prepareDefaultPdfData(tempalte)
    }

    public list(artistSignature: string, managerUid: string): Promise<PdfData[]> {
        return this.pdfDataModel.find({
            artistSignature,
            managerUid
        }).exec()
    }
    
    public async save(artistSignature: string, dto: PdfDataDto, profile: JwtPayload): Promise<PdfData> {
        if (Number(dto.id)) {
            const existing = await this.getById(dto.id)
            if (existing) {
                await this.update(dto)
                return this.getById(dto.id)
            }
        }
        const newPdfData = await this.create(artistSignature, dto, profile)
        this.logger.log(`Created new PdfData for artist ${newPdfData.artistSignature}, manager: ${newPdfData.managerUid}`)
        return newPdfData
    }

    private async update(dto: PdfDataDto): Promise<void> {
        const update = await this.pdfDataModel.updateOne({ id: dto.id }, { $set: {
            name: dto.name,
            header: dto.header,
            sections: dto.sections,
            modified: new Date(),
        } }).exec()
        if (!update.modifiedCount) {
            throw new IllegalStateException(`Not updated PdfData ${dto.id}`)
        }
        this.logger.log(`Updated PdfData ${dto.id}, name: ${dto.name}`)
    }

    private create(artistSignature: string, dto: PdfDataDto, profile: JwtPayload): Promise<PdfData> {
        const pdfData = new this.pdfDataModel({
            ...dto,
            id: uuidv4(),
            active: false,
            created: new Date(),
            modified: new Date(),
            managerUid: profile.uid,
            artistSignature
        })
        return pdfData.save()
    }

    public getById(id: string): Promise<PdfData> {
        return this.pdfDataModel.findOne({ id }).exec()
    }

    public get(name: string, artistUid: string, managerUid: string): Promise<PdfData> {
        return this.pdfDataModel.findOne({
            name,
            artistUid,
            managerUid
        }).exec()
    }
    
}
