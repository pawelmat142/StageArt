import { Controller, Get } from '@nestjs/common';
import { MigrationService } from './migration.service';

@Controller('api/migration')
export class MigrationController {
  constructor(private readonly migrationService: MigrationService) {}

  @Get()
  async migrateData(): Promise<string> {
    await this.migrationService.migrate();
    return 'Migration completed successfully!';
  }
}