import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LogInterceptor } from '../global/interceptors/log.interceptor';
import { PdfDataService } from './pdf-data.service';
import { PdfDataDto, PdfTemplate } from './model/pdf-data';
import { RoleGuard } from '../profile/auth/role.guard';
import { Role } from '../profile/model/role';
import { JwtPayload } from '../profile/auth/jwt-strategy';
import { GetProfile } from '../profile/auth/profile-path-param-getter';
import { Serialize } from '../global/interceptors/serialize.interceptor';
import { Response } from 'express';
import { PaperUtil } from '../document/paper-util';

@Controller('api/pdf-data')
@UseInterceptors(LogInterceptor)
@UseGuards(RoleGuard(Role.MANAGER))
export class PdfDataController {
  constructor(private readonly pdfDataService: PdfDataService) {}

  @Get('/default/:template')
  getDefaultPdfData(@Param('template') template: PdfTemplate) {
    return this.pdfDataService.getDefaultPdfData(template);
  }

  @Get('/list/:artistSignature')
  @Serialize(PdfDataDto)
  list(
    @Param('artistSignature') artistSignature: string,
    @GetProfile() profile: JwtPayload,
  ) {
    return this.pdfDataService.list(artistSignature, profile.uid);
  }

  @Get('/name/:name/:artistSignature')
  @Serialize(PdfDataDto)
  getByName(
    @Param('name') name: string,
    @Param('artistSignature') artistSignature: string,
    @GetProfile() profile: JwtPayload,
  ) {
    return this.pdfDataService.getByName(name, artistSignature, profile.uid);
  }

  @Put('save/:artistSignature')
  @Serialize(PdfDataDto)
  save(
    @Param('artistSignature') artistSignature: string,
    @Body() dto: PdfDataDto,
    @GetProfile() profile: JwtPayload,
  ) {
    return this.pdfDataService.save(artistSignature, dto, profile);
  }

  @Delete('/:id')
  delete(@Param('id') id: string, @GetProfile() profile: JwtPayload) {
    return this.pdfDataService.delete(id, profile);
  }

  @Get('/activate/:id/:template')
  activate(
    @Param('id') id: string,
    @Param('template') template: PdfTemplate,
    @GetProfile() profile: JwtPayload,
  ) {
    return this.pdfDataService.activate(id, profile, template);
  }

  @Get('/deactivate/:id/:template')
  deactivate(
    @Param('id') id: string,
    @Param('template') template: PdfTemplate,
    @GetProfile() profile: JwtPayload,
  ) {
    return this.pdfDataService.deactivate(id, profile, template);
  }

  @Get('/preview/:id/')
  async generatePreview(
    @Res() res: Response,
    @Param('id') id: string,
    @GetProfile() profile: JwtPayload,
  ) {
    const buffer = await this.pdfDataService.generatePreview(id, profile);
    PaperUtil.fileResponse(res, buffer, `preview.pdf`);
  }

  @Get('/preview-default/:template')
  async generatePreviewDefault(
    @Res() res: Response,
    @Param('template') template: PdfTemplate,
  ) {
    const buffer = await this.pdfDataService.generatePreviewDefault(template);
    PaperUtil.fileResponse(res, buffer, `preview.pdf`);
  }
}
