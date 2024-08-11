import { Injectable, Logger } from '@nestjs/common';
import { WizardService } from './wizard.service';
import TelegramBot = require("node-telegram-bot-api")

@Injectable()
export class TelegramService {

    private readonly logger = new Logger(this.constructor.name)

    private readonly channelId = process.env.TELEGRAM_CHANNEL_ID

    constructor(
        private readonly wizardService: WizardService
    ) {}



    public async sendMessage(chatId: number, message: string): Promise<TelegramBot.Message> {
        const result = await this.wizardService.sendMessage(chatId, message)
        return result
    }
}
