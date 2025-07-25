import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PdfDataDto, PdfTemplate } from './model/pdf-data';
import { InjectModel } from '@nestjs/mongoose';
import { PdfData, PdfDataDocument } from './model/pdf-data.model';
import { PdfUtil } from './pdf.util';
import { Model, RootFilterQuery } from 'mongoose';
import { JwtPayload } from '../profile/auth/jwt-strategy';
import { v4 as uuidv4 } from 'uuid';
import { IllegalStateException } from '../global/exceptions/illegal-state.exception';
import { PdfGeneratorService } from './pdf-generator.service';

@Injectable()
export class PdfDataService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectModel(PdfData.name) private pdfDataModel: Model<PdfData>,
    private readonly pdfGeneratorService: PdfGeneratorService,
  ) {}

  public find(filter: RootFilterQuery<PdfData>): Promise<PdfDataDocument> {
    return this.pdfDataModel.findOne(filter).exec();
  }

  public getDefaultPdfData(tempalte: PdfTemplate): PdfData {
    return PdfUtil.prepareDefaultPdfData(tempalte);
  }

  public list(artistSignature: string, managerUid: string): Promise<PdfData[]> {
    return this.pdfDataModel
      .find(
        {
          artistSignature,
          managerUid,
        },
        {
          sections: false,
        },
      )
      .exec();
  }

  public getByName(
    name: string,
    artistSignature: string,
    managerUid: string,
  ): Promise<PdfData> {
    return this.get(name, artistSignature, managerUid);
  }

  public async save(
    artistSignature: string,
    dto: PdfDataDto,
    profile: JwtPayload,
  ): Promise<PdfData> {
    if (dto.id) {
      const existing = await this.getById(dto.id, profile.uid);
      if (existing) {
        await this.update(dto);
        return this.getById(dto.id, profile.uid);
      }
    }
    const newPdfData = await this.create(artistSignature, dto, profile);
    this.logger.log(
      `Created new PdfData for artist ${newPdfData.artistSignature}, manager: ${newPdfData.managerUid}`,
    );
    return newPdfData;
  }

  public async delete(id: string, profile: JwtPayload) {
    const deleted = await this.pdfDataModel
      .deleteOne({
        id,
        managerUid: profile.uid,
      })
      .exec();
    if (!deleted.deletedCount) {
      throw new IllegalStateException(`Not found PdfData ${id}`);
    }
    this.logger.log(`Deleted PdfData ${id}`);
  }

  public async activate(
    id: string,
    profile: JwtPayload,
    template: PdfTemplate,
  ) {
    if (!template) {
      throw new NotFoundException(`PdfTemplate not provided`);
    }
    const pdfData = await this.getById(id, profile.uid);
    if (!pdfData) {
      throw new NotFoundException(`Not found PdfData ${id}`);
    }
    await this.pdfDataModel.updateMany(
      {
        managerUid: profile.uid,
        artistSignature: pdfData.artistSignature,
        id: { $ne: id },
        template,
      },
      { $set: { active: false } },
    );

    const update = await this.pdfDataModel.updateOne(
      {
        managerUid: profile.uid,
        artistSignature: pdfData.artistSignature,
        template,
        id,
      },
      { $set: { active: true } },
    );

    if (!update.modifiedCount) {
      throw new IllegalStateException(`Activation failed`);
    }
    this.logger.log(
      `Activated PdfData ${id}, for Artist ${pdfData.artistSignature}, by ${profile.uid}`,
    );
  }

  public async deactivate(
    id: string,
    profile: JwtPayload,
    template: PdfTemplate,
  ) {
    if (!template) {
      throw new NotFoundException(`PdfTemplate not provided`);
    }
    const pdfData = await this.getById(id, profile.uid);
    if (!pdfData) {
      throw new NotFoundException(`Not found PdfData ${id}`);
    }
    const update = await this.pdfDataModel.updateOne(
      {
        managerUid: profile.uid,
        artistSignature: pdfData.artistSignature,
        template,
        id,
      },
      { $set: { active: false } },
    );

    if (!update.modifiedCount) {
      throw new IllegalStateException(`Activation failed`);
    }
    this.logger.log(
      `Deactivated PdfData ${id}, for Artist ${pdfData.artistSignature}, by ${profile.uid}`,
    );
  }

  private async update(dto: PdfDataDto): Promise<void> {
    const update = await this.pdfDataModel
      .updateOne(
        { id: dto.id },
        {
          $set: {
            name: dto.name,
            header: dto.header,
            sections: dto.sections,
            modified: new Date(),
          },
        },
      )
      .exec();
    if (!update.modifiedCount) {
      throw new IllegalStateException(`Not updated PdfData ${dto.id}`);
    }
    this.logger.log(`Updated PdfData ${dto.id}, name: ${dto.name}`);
  }

  private create(
    artistSignature: string,
    dto: PdfDataDto,
    profile: JwtPayload,
  ): Promise<PdfData> {
    const pdfData = new this.pdfDataModel({
      ...dto,
      id: uuidv4(),
      active: false,
      created: new Date(),
      modified: new Date(),
      managerUid: profile.uid,
      artistSignature,
    });
    return pdfData.save();
  }

  public getById(id: string, managerUid: string): Promise<PdfData> {
    return this.pdfDataModel.findOne({ id, managerUid }).exec();
  }

  public get(
    name: string,
    artistSignature: string,
    managerUid: string,
  ): Promise<PdfData> {
    return this.pdfDataModel
      .findOne({
        name,
        artistSignature,
        managerUid,
      })
      .exec();
  }

  public async generatePreview(
    id: string,
    profile: JwtPayload,
  ): Promise<Buffer> {
    const pdfData = await this.pdfDataModel
      .findOne({
        id,
        managerUid: profile.uid,
      })
      .exec();

    if (!pdfData) {
      throw new NotFoundException(
        `Not found PdfData wth id: ${id} by ${profile.uid}`,
      );
    }

    const buffer = await this.pdfGeneratorService.generate(
      pdfData.template,
      pdfData.toObject(),
    );
    return buffer;
  }
  public async generatePreviewDefault(template: PdfTemplate): Promise<Buffer> {
    const buffer = await this.pdfGeneratorService.generate(template);
    return buffer;
  }
}
