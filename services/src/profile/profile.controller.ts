import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoginToken, ProfileTelegramService } from './profile-telegram.service';

@Controller('api/profile')
export class ProfileController {

    constructor(
        private readonly profileTelegramService: ProfileTelegramService
    ) {}

    @Get('telegram')
    fetchTelegramBotHref() {
        return { url: `tg://resolve?domain=${process.env.TELEGRAM_BOT_NAME}`}
    }

    @Post('login/pin')
    loginByPin(@Body() body: Partial<LoginToken>) {
        return this.profileTelegramService.loginByPin(body)
    }

}
