import {
  Body,
  Controller,
  Logger,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { Feedback } from './feedback.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProfileInterceptor } from '../global/interceptors/profile.interceptor';
import { GetProfile } from '../profile/auth/profile-path-param-getter';
import { JwtPayload } from '../profile/auth/jwt-strategy';
import { LogInterceptor } from '../global/interceptors/log.interceptor';

@Controller('api/feedback')
@UseInterceptors(ProfileInterceptor)
@UseInterceptors(LogInterceptor)
export class FeedbackController {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    @InjectModel(Feedback.name) private feedbackModel: Model<Feedback>,
  ) {}

  @Post()
  sendFeedback(
    @Body() body: { value: string },
    @GetProfile() profile?: JwtPayload,
  ) {
    const feedback = new this.feedbackModel({
      created: new Date(),
      lines: body.value.split(/\r?\n/),
      uid: profile?.uid || 'anonymous',
    });

    this.logger.log(feedback.lines);
    return feedback.save();
  }
}
