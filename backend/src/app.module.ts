import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as cors from 'cors';
import { isLocalEnv } from './book-agency';
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

@Module({
  imports: [
    ConfigModule.forRoot(),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'angular', 'browser'),
    }),

    MongooseModule.forRoot(process.env.MONGO_URI),

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
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    if (isLocalEnv) {
      consumer
        .apply(cors({
          origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
          methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
          credentials: true,
          allowedHeaders: 'Content-Type, Accept, Authorization',
          exposedHeaders: 'Content-Disposition'
        }))
        .forRoutes('*');
    }
  }

}

