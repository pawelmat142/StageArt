import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './model/profile.model';
import { ConfigModule } from '@nestjs/config';
import { ProfileTelegramService } from './profile-telegram.service';
import { ProfileEmailService } from './profile-email.service';
import { JwtGuard } from './auth/jwt.guard';
import { AppJwtService } from './auth/app-jwt.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Profile.name,
        schema: ProfileSchema,
      },
    ]),
    ConfigModule,
  ],
  providers: [
    ProfileService,
    ProfileTelegramService,
    ProfileEmailService,
    JwtGuard,
    AppJwtService,
  ],
  controllers: [ProfileController],
  exports: [
    ProfileTelegramService,
    ProfileEmailService,
    ProfileService,
    JwtGuard,
    AppJwtService,
  ],
})
export class ProfileModule {}
