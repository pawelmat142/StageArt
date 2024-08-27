import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Profile } from "../model/profile.model";
import { Model } from "mongoose";
import { JwtPayload } from "../auth/jwt-strategy";
import { HandSignature } from "../model/profile-interfaces";

@Injectable()
export class SignatureService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        @InjectModel(Profile.name) private profileModel: Model<Profile>,
    ) {}

    public async fetchSignature(uid: string): Promise<HandSignature> {
        const signatureProfile = await this.profileModel.findOne({ uid })
        return signatureProfile?.signature
    }

    public async setSignature(signature: HandSignature, profile: JwtPayload) {
        const update = await this.profileModel.updateOne({ uid: profile.uid }, { $set: {
            signature: signature
        } })
        if (update.modifiedCount) {
            this.logger.log(`Set signature success for profile ${profile.uid}`)
            return signature
        }
        this.logger.log(`Set signature failed for profile ${profile.uid}`)
        return null
    }

    public async removeSignature(uid: string): Promise<{ result: boolean }> {
        const update = await this.profileModel.updateOne({ uid }, { $unset: { signature: 1 } })
        if (update.modifiedCount) {
            this.logger.log(`Remove signature success for profile ${uid}`)
        } else {
            this.logger.log(`Remove signature failed for profile ${uid}`)
        }
        return { result: !!update.modifiedCount }
    }


}