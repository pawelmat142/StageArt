import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './model/profile.model';
import { ConfigModule } from '@nestjs/config';
import { ProfileTelegramService } from './profile-telegram.service';
import { AppJwtService } from './auth/app-jwt.service';
import { ProfileEmailService } from './profile-email.service';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Profile.name,
      schema: ProfileSchema
    }]),

    ConfigModule,
  ],
  providers: [
    ProfileService,
    ProfileTelegramService,
    AppJwtService,
    ProfileEmailService
  ],
  controllers: [ProfileController],
  exports: [
    ProfileTelegramService
  ]
})
export class ProfileModule {}
