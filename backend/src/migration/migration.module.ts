import { Module } from '@nestjs/common';
import { MigrationController } from './migration.controller';
import { MigrationService } from './migration.service';
import { MongooseModule } from '@nestjs/mongoose';

const getMongoUri = (): string => {
    const a = process.env.MONGO_URI
    console.log('migration MONGO_URI:', a);
    return a
}

const getMongoUri2 = (): string => {
    const a = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@bookagency_mongo:27017/destination?authSource=admin`
    console.log('migration MONGO_URI 2:', a);
    return a
}

@Module({
  imports: [
    MongooseModule.forRoot(getMongoUri(), { connectionName: 'source' }),
    MongooseModule.forRoot(getMongoUri2(), { connectionName: 'destination' }),
  ],
  controllers: [MigrationController],
  providers: [MigrationService],
})
export class MigrationModule {}