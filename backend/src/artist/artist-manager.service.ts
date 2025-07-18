import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Artist, ArtistStatus } from './model/artist.model';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IllegalStateException } from '../global/exceptions/illegal-state.exception';
import { JwtPayload } from '../profile/auth/jwt-strategy';
import { TimelineItem } from '../booking/services/artist-timeline.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArtistManagerService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(@InjectModel(Artist.name) private artistModel: Model<Artist>) {}

  public fetchArtistsOfManager(profile: JwtPayload) {
    return this.artistModel.find({ managerUid: profile.uid });
  }

  public async putManagementNotes(
    body: { managmentNotes: string; artistSignture: string },
    profile: JwtPayload,
  ): Promise<void> {
    const update = await this.artistModel.updateOne(
      { signature: body.artistSignture, managerUid: profile.uid },
      { $set: { managmentNotes: body.managmentNotes } },
    );
    if (!update.modifiedCount) {
      throw new BadRequestException(
        `Not modified management notes for Artist: ${body.artistSignture} by manager: ${profile.uid}`,
      );
    }
    this.logger.log(
      `Management notes put success for Artist: ${body.artistSignture} by manager: ${profile.uid}`,
    );
  }

  public async setStatus(
    status: ArtistStatus,
    signature: string,
    profile: JwtPayload,
  ) {
    const update = await this.artistModel.updateOne(
      { signature, managerUid: profile.uid },
      {
        $set: {
          status: status,
          modified: new Date(),
        },
      },
    );
    if (!update.modifiedCount) {
      this.logger.error(
        `Not modified status artist: ${signature}, by ${profile.uid}`,
      );
      throw new NotFoundException();
    }
    this.logger.log(
      `Modified status ${status} artist: ${signature}, by ${profile.uid}`,
    );
  }

  public async submitTimelineEvent(
    artistSignature: string,
    event: TimelineItem,
    profile: JwtPayload,
  ): Promise<TimelineItem[]> {
    // TODO validate overlapse dates
    const authFilter = this.manageFilter(profile);
    const artist = await this.artistModel
      .findOne({
        $and: [authFilter, { signature: artistSignature }],
      })
      .exec();
    if (!artist) {
      throw new NotFoundException(
        `Not found Artist ${artistSignature} when trying to submit timeline event, ${profile.uid}`,
      );
    }
    const timeline = artist.toObject().timeline || [];

    const index = timeline.findIndex((item) => item.id === event.id);

    if (index === -1) {
      (event.id = uuidv4()), (event.uid = profile.uid);
      timeline.push(event);
    } else {
      timeline.splice(index, 1, event);
    }
    const update = await this.artistModel.updateOne(
      {
        signature: artistSignature,
      },
      { $set: { timeline: timeline } },
    );

    if (!update.modifiedCount) {
      throw new IllegalStateException(
        `Not modified ${artistSignature} when trying to submit timeline event, ${profile.uid}`,
      );
    }
    this.logger.log(
      `Modified Artist ${artistSignature} timeline when trying to submit timeline event, ${profile.uid}`,
    );
    return timeline;
  }

  public async removeTimelineEvent(
    artistSignature: string,
    id: string,
    profile: JwtPayload,
  ) {
    const authFilter = this.manageFilter(profile);
    const artist = await this.artistModel
      .findOne({
        $and: [authFilter, { signature: artistSignature }],
      })
      .exec();
    if (!artist) {
      throw new NotFoundException(
        `Not found Artist ${artistSignature} when trying to remove timeline event, ${profile.uid}`,
      );
    }
    const timeline = artist.toObject().timeline || [];

    const index = timeline.findIndex((item) => item.id === id);

    if (index !== -1) {
      timeline.splice(index, 1);
    } else {
      throw new IllegalStateException(
        `Not modified ${artistSignature} when trying to remove timeline event, ${profile.uid}`,
      );
    }
    const update = await this.artistModel.updateOne(
      {
        signature: artistSignature,
      },
      { $set: { timeline: timeline } },
    );
    this.logger.log(`Removed Artist ${artistSignature} timeline event, ${id}`);
    return timeline;
  }

  private manageFilter(profile: JwtPayload): FilterQuery<Artist> {
    return profile.artistSignature
      ? { signature: profile.artistSignature }
      : { managerUid: profile.uid };
  }
}
