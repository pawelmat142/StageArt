import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './model/event.model';
import { EventController } from './event.controller';
import { ProfileModule } from '../profile/profile.module';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Event.name,
      schema: EventSchema
    }]),

    ProfileModule,
  ],
  providers: [
    EventService,
  ],
  exports: [
    EventService
  ],
  controllers: [EventController]
})
export class EventModule {}
