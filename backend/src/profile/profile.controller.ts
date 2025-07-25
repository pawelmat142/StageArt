import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LoginToken, ProfileTelegramService } from './profile-telegram.service';
import { LoginForm, ProfileEmailService } from './profile-email.service';
import { ProfileService } from './profile.service';
import { JwtGuard } from './auth/jwt.guard';
import { Serialize } from '../global/interceptors/serialize.interceptor';
import { ProfileDto } from './model/profile.dto';
import { GetProfile } from './auth/profile-path-param-getter';
import { JwtPayload } from './auth/jwt-strategy';
import { Profile } from './model/profile.model';
import { LogInterceptor } from '../global/interceptors/log.interceptor';
import { ManagerData } from './model/profile-interfaces';
import { RoleGuard } from './auth/role.guard';
import { Role } from './model/role';
import { MessageException } from '../global/exceptions/message-exception';

@Controller('api/profile')
@UseInterceptors(LogInterceptor)
export class ProfileController {
  constructor(
    private readonly profileTelegramService: ProfileTelegramService,
    private readonly profileEmailService: ProfileEmailService,
    private readonly profileService: ProfileService,
  ) {}

  @Get('full')
  @UseGuards(JwtGuard)
  @Serialize(Profile)
  fetchFullProfile(@GetProfile() payload: JwtPayload) {
    return this.profileService.fetchFullProfile(payload);
  }

  @Get('managers')
  @UseGuards(JwtGuard)
  @Serialize(ProfileDto)
  fetchManagers() {
    return this.profileService.fetchManagers();
  }

  @Get('manager-data')
  @UseGuards(RoleGuard(Role.MANAGER))
  fetchManagerData(@GetProfile() profile: JwtPayload) {
    return this.profileService.fetchManagerData(profile.uid);
  }

  @Put('manager-data')
  @UseGuards(JwtGuard)
  setManagerData(@Body() body: ManagerData, @GetProfile() profile: JwtPayload) {
    return this.profileService.setManagerData(body, profile);
  }

  // TELEGRAM
  @Get('telegram')
  fetchTelegramBotHref() {
    return { url: `tg://resolve?domain=${process.env.TELEGRAM_BOT_NAME}` };
  }

  @Get('telegram/pin/:id')
  telegramPinRequest(@Param('id') uidOrNameOrEmail: string) {
    return this.profileTelegramService.telegramPinRequest(uidOrNameOrEmail);
  }

  @Post('login/pin')
  loginByPin(@Body() body: Partial<LoginToken>) {
    return this.profileTelegramService.loginByPin(body);
  }

  @Get('refresh-token')
  @UseGuards(JwtGuard)
  refreshToken(@GetProfile() profile: JwtPayload) {
    return this.profileService.refreshToken(profile);
  }

  //EMAIL
  @Post('email/register')
  createProfileEmail(@Body() body: LoginForm) {
    return this.profileEmailService.createProfile(body);
  }

  @Post('email/login')
  loginByEmail(@Body() body: Partial<LoginForm>) {
    return this.profileEmailService.loginByEmail(body);
  }
}
