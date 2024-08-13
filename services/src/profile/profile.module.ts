import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './model/profile.model';
import { ConfigModule } from '@nestjs/config';
import { ProfileTelegramService } from './profile-telegram.service';
import { AppJwtService } from './auth/app-jwt.service';
import { ProfileEmailService } from './profile-email.service';
import { JwtGuard } from './auth/jwt.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Profile.name,
      schema: ProfileSchema
    }]),

    ConfigModule,
  ],
  providers: [
    AppJwtService,
    ProfileService,
    ProfileTelegramService,
    ProfileEmailService,
    JwtGuard
  ],
  controllers: [ProfileController],
  exports: [
    ProfileTelegramService,
    ProfileService,
    AppJwtService,
    JwtGuard
  ]
})
export class ProfileModule {}
