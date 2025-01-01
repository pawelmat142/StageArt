import { Body, Controller, Get, Param, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { LogInterceptor } from '../global/interceptors/log.interceptor';
import { PdfDataService } from './pdf-data.service';
import { PdfDataDto, PdfTemplate } from './model/pdf-data';
import { RoleGuard } from '../profile/auth/role.guard';
import { Role } from '../profile/model/role';
import { JwtPayload } from '../profile/auth/jwt-strategy';
import { GetProfile } from '../profile/auth/profile-path-param-getter';
import { Serialize } from '../global/interceptors/serialize.interceptor';

@Controller('api/pdf-data')
@UseInterceptors(LogInterceptor)
@UseGuards(RoleGuard(Role.MANAGER))
export class PdfDataController {

    constructor(
        private readonly pdfDataService: PdfDataService,
    ) {}

    @Get('/default/:template')
    fetchSubmitted(@Param('template') template: PdfTemplate) {
        return this.pdfDataService.getDefaultPdfData(template)
    }

    @Get('/list/:artistSignature')
    @Serialize(PdfDataDto)
    list(
        @Param('artistSignature') artistSignature: string, 
        @GetProfile() profile: JwtPayload
    ) {
        return this.pdfDataService.list(artistSignature, profile.uid)
    }
    
    @Put('save/:artistSignature')
    @Serialize(PdfDataDto)
    save(
        @Param('artistSignature') artistSignature: string,
        @Body() dto: PdfDataDto, 
        @GetProfile() profile: JwtPayload
    ) {
        return this.pdfDataService.save(artistSignature, dto, profile)
    }


}
