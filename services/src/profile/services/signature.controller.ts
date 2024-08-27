import { Body, Controller, Delete, Get, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { SignatureService } from './signature.service';
import { LogInterceptor } from '../../global/interceptors/log.interceptor';
import { JwtGuard } from '../auth/jwt.guard';
import { GetProfile } from '../auth/profile-path-param-getter';
import { JwtPayload } from '../auth/jwt-strategy';
import { HandSignature } from '../model/profile-interfaces';

@Controller('api/profile/signature')
@UseInterceptors(LogInterceptor)
@UseGuards(JwtGuard)
export class SignatureController {

    constructor(
        private readonly signatureService: SignatureService
    ) {}

    @Get()
    fetchSignature(@GetProfile() profile: JwtPayload) {
        return this.signatureService.fetchSignature(profile.uid)
    }

    @Put()
    setSignature(@Body() body: HandSignature, @GetProfile() profile: JwtPayload) {
        return this.signatureService.setSignature(body, profile)
    }

    @Delete()
    removeSignature(@GetProfile() profile: JwtPayload) {
        return this.signatureService.removeSignature(profile.uid)
    }

}
