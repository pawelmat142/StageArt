import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { WizardService } from './wizard.service';
import TelegramBot = require("node-telegram-bot-api")
import { ProfileTelegramService } from '../profile/profile-telegram.service';

@Injectable()
export class TelegramService implements OnModuleInit{

    private readonly logger = new Logger(this.constructor.name)

    private readonly channelId = process.env.TELEGRAM_CHANNEL_ID

    constructor(
        private readonly wizardService: WizardService,
        private readonly profileTelegramService: ProfileTelegramService,
    ) {}


    onModuleInit() {
        this.profileTelegramService.sendMessageObs$.subscribe(msg => {
            this.logger.log(`Sending message to channel ${msg.telegramChannelId}`)
            this.sendMessage(Number(msg.telegramChannelId), msg.message)
        })
    }

    public async sendMessage(chatId: number, message: string): Promise<TelegramBot.Message> {
        const result = await this.wizardService.sendMessage(chatId, message)
        return result
    }
}
