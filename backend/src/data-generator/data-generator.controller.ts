import { Controller, Get } from '@nestjs/common';
import { DataGeneratorService } from './data-generator.service';

@Controller('api/data-generator')
export class DataGeneratorController {
  constructor(private readonly dataGeneratorService: DataGeneratorService) {}
  @Get()
  dataGenerator() {
    this.dataGeneratorService.dataGenerator();
  }
}
