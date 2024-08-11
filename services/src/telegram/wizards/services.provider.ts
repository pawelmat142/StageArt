import { Injectable } from "@nestjs/common";
import { ProfileTelegramService } from "../../profile/profile-telegram.service";

@Injectable()
export class ServiceProvider {
    
    constructor(
        readonly profileTelegramService: ProfileTelegramService,
    ) {}

}