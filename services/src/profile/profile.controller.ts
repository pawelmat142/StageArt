import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LoginToken, ProfileTelegramService } from './profile-telegram.service';
import { LoginForm, ProfileEmailService } from './profile-email.service';

@Controller('api/profile')
export class ProfileController {

    constructor(
        private readonly profileTelegramService: ProfileTelegramService,
        private readonly profileEmailService: ProfileEmailService,
    ) {}

    // TELEGRAM
    @Get('telegram')
    fetchTelegramBotHref() {
        return { url: `tg://resolve?domain=${process.env.TELEGRAM_BOT_NAME}`}
    }

    @Get('telegram/pin/:id')
    telegramPinRequest(@Param('id') uidOrNameOrEmail: string) {
        return this.profileTelegramService.telegramPinRequest(uidOrNameOrEmail)
    }

    @Post('login/pin')
    loginByPin(@Body() body: Partial<LoginToken>) {
        return this.profileTelegramService.loginByPin(body)
    }


    //EMAIL
    @Post('email/register')
    createProfileEmail(@Body() body: LoginForm) {
        return this.profileEmailService.createProfile(body)
    }

    @Post('email/login')
    loginByEmail(@Body() body: Partial<LoginForm>) {
        return this.profileEmailService.loginByEmail(body)
    }

}
