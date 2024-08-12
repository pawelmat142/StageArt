import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, RegisterMode } from './model/profile.model';
import { Model } from 'mongoose';

export interface Credentials {
    email: string
    password: string
}

@Injectable()
export class ProfileService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        @InjectModel(Profile.name) private profileModel: Model<Profile>,
    ) {}

    public findById(uid: string) {
        return this.profileModel.findOne({ uid })
    }



    async createProfile(profile: Partial<Profile>, registerMode: RegisterMode) {

        const checkName = await this.profileModel.findOne({ name: profile.name })
        if (checkName) {
            throw new BadRequestException('Name already n use')
        } 

        const user = new this.profileModel({
            uid: profile.uid,
            name: profile.name,
            role: profile.role,

            registerMode: registerMode,
            telegramChannelId: profile.telegramChannelId,
            email: profile.email,
            passwordHash: profile.passwordHash,

            created: new Date(),
            modified: new Date(),
        })

        await user.save()
        this.logger.log(`Created user ${user.name}, uid: ${user.uid}`)
    }


}
