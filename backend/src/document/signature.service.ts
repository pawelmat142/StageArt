import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PutSignatureDto, Signature } from './signature.model';
import { Model } from 'mongoose';
import { JwtPayload } from '../profile/auth/jwt-strategy';
import { v4 as uuidv4 } from 'uuid';
import { Status } from '../global/status';

@Injectable()
export class SignatureService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectModel(Signature.name) private signatureModel: Model<Signature>,
  ) {}

  public async listSignatures(uid: string) {
    const signatures = await this.signatureModel.find({
      uid,
      status: { $eq: Status.READY },
    });
    this.logger.log(`Found ${signatures.length} for ${uid}`);
    return signatures;
  }

  public async putSignature(
    dto: PutSignatureDto,
    profile: JwtPayload,
  ): Promise<{ id: string } | undefined> {
    if (dto.id) {
      const update = await this.signatureModel
        .updateOne(
          {
            id: dto.id,
            uid: profile.uid,
          },
          {
            $set: {
              base64data: dto.base64data,
              size: dto.size,
              modified: new Date(),
            },
          },
        )
        .exec();

      if (update.modifiedCount) {
        this.logger.log(`Updated signature ${dto.id} by ${profile.uid}`);
        return { id: dto.id };
      } else {
        this.logger.warn(`Update signature failed create new...`);
      }
    }
    const newSignature = await this.createSignature(dto, profile);
    return { id: newSignature.id };
  }

  public async cancelSignature(id: string, uid: string) {
    const update = await this.signatureModel.updateOne(
      {
        id,
        uid,
      },
      {
        $set: {
          status: Status.CANCELED,
          modified: new Date(),
        },
      },
    );
    if (update.modifiedCount) {
      this.logger.log(`Cancelled signature ${id} by ${uid}`);
    } else {
      throw new NotFoundException(
        `Not found signature ${id} by ${uid} - trying cancell`,
      );
    }
  }

  private async createSignature(
    dto: PutSignatureDto,
    profile: JwtPayload,
  ): Promise<Signature> {
    const signature = new this.signatureModel({
      id: uuidv4(),
      uid: profile.uid,
      status: Status.READY,
      created: new Date(),
      base64data: dto.base64data,
      size: dto.size,
    });
    const saved = await signature.save();
    this.logger.log(`Creared new signature ${saved.id} by ${signature.uid}`);
    return saved;
  }

  async fetch(id: string, uid: string): Promise<Signature> {
    const signature = await this.signatureModel.findOne({ id, uid });
    if (!signature) {
      throw new UnauthorizedException(
        `Not found Signature ${id} for user ${uid}`,
      );
    }
    return signature;
  }
}
