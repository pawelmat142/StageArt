import { Module } from '@nestjs/common';
import { MigrationController } from './migration.controller';
import { MigrationService } from './migration.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI, { connectionName: 'source' }),
    MongooseModule.forRoot(`mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@bookagency_mongo_dev:27017/destination?authSource=admin`, { connectionName: 'destination' }),
  ],
  controllers: [MigrationController],
  providers: [MigrationService],
})
export class MigrationModule {}