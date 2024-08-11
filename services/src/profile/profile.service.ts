import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from './model/profile.model';
import { Model } from 'mongoose';
import { ProfileTelegramService } from './profile-telegram.service';

export interface Credentials {
    email: string
    password: string
}

@Injectable()
export class ProfileService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        @InjectModel(Profile.name) private profileModel: Model<Profile>,
        private readonly profileTelegramService: ProfileTelegramService,
    ) {}

    public findById(uid: string) {
        return this.profileModel.findOne({ uid })
    }




}
