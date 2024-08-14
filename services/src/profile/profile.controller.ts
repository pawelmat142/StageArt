import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LoginToken, ProfileTelegramService } from './profile-telegram.service';
import { LoginForm, ProfileEmailService } from './profile-email.service';
import { ProfileService } from './profile.service';
import { JwtGuard } from './auth/jwt.guard';
import { GetProfile } from './auth/profile-path-param-getter';
import { JwtPayload } from './auth/jwt-strategy';

@Controller('api/profile')
export class ProfileController {

    constructor(
        private readonly profileTelegramService: ProfileTelegramService,
        private readonly profileEmailService: ProfileEmailService,
        private readonly profileService: ProfileService,
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
