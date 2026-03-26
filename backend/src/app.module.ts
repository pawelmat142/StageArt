import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ArtistModule } from './artist/artist.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FormModule } from './form/form.module';
import { ProfileModule } from './profile/profile.module';
import { TelegramModule } from './telegram/telegram.module';
import { BookingModule } from './booking/booking.module';
import { FeedbackModule } from './feedback/feedback.module';
import { EventModule } from './event/event.module';
import { DocumentModule } from './document/document.module';
import { PdfModule } from './pdf/pdf.module';
import { DataGeneratorModule } from './data-generator/data-generator.module';
import { MigrationModule } from './migration/migration.module';


const mongoUri = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@bookagency_mongo:27017/destination?authSource=admin`;


const getMongoUri = (): string => {
    const a = process.env.MONGO_URI
    console.log('MONGO_URI:', a);
    console.log('MONGO_INITDB_ROOT_USERNAME:', process.env.MONGO_INITDB_ROOT_USERNAME);
    console.log('MONGO_INITDB_ROOT_PASSWORD:', process.env.MONGO_INITDB_ROOT_PASSWORD);
    return a
}

@Module({
  imports: [
    ConfigModule.forRoot(),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'angular', 'browser'),
    }),

    MongooseModule.forRootAsync({
      useFactory: () => {
        // return { uri: mongoUri };
        return { uri: getMongoUri() };
      },
    }),

    ArtistModule,

    FormModule,

    ProfileModule,

    TelegramModule,

    BookingModule,

    FeedbackModule,

    EventModule,

    DocumentModule,

    PdfModule,

    DataGeneratorModule,

    MigrationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
