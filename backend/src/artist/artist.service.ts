import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Artist, ArtistLabel, ArtistStatus, ArtistStyle } from './model/artist.model';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IllegalStateException } from '../global/exceptions/illegal-state.exception';
import { ArtistViewDto } from './model/artist-view.dto';
import { JwtPayload } from '../profile/auth/jwt-strategy';
import { ArtistUtil } from './artist.util';
import { ArtistForm, FetchArtistQuery, SelectorItem } from './artist.controller';
import { ProfileService } from '../profile/profile.service';
import { TelegramService } from '../telegram/telegram.service';
import { BotUtil } from '../telegram/util/bot.util';
import { BookingSubmitCtx } from '../booking/services/submit.service';
import { FormUtil } from '../form/form.util';
import { TimelineItem } from '../booking/services/artist-timeline.service';
import { v4 as uuidv4 } from 'uuid';
import { MessageException } from '../global/exceptions/message-exception';

@Injectable()
export class ArtistService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        @InjectModel(Artist.name) private artistModel: Model<Artist>,
        private readonly profileService: ProfileService,
        private readonly telegramService: TelegramService,
    ) {}


    private readonly PUBLIC_VIEW_ARTIST_STATUSES: ArtistStatus[] = [ 'ACTIVE' ]

    public async createArtist(form: ArtistForm, profile: JwtPayload): Promise<ArtistViewDto> {
        const checkName = await this.artistModel.findOne({ name: form.artistName })
        if (checkName) {
            throw new MessageException(`Artist name taken`)
        }

        const newArtist = new this.artistModel({
            signature: this.prepareArtistSignature(form.artistName),
            name: form.artistName,
            status: 'CREATED',
            images: { bg: [], avatar: {} },
            created: new Date(),
            managerUid: form.manager.code,
        })

        await this.profileService.updateArtistProfile(form, profile, newArtist.signature)

        const saved = await newArtist.save()
        this.logger.warn(`Artist created, name: ${newArtist.name}, signature: ${newArtist.signature}`)
        return saved
    }

    public fetchArtist(query: FetchArtistQuery) {
        if (query.name) {
            return this.artistModel.findOne({ name: query.name })
        } 
        if (query.signature) {
            return this.artistModel.findOne({ signature: query.signature })
        }
        throw new BadRequestException(`Name or signature required`)
    }

    public getArtist(signature: string) {
        return this.artistModel.findOne({ signature }).exec()
    }
    
    getArtists(signatures: string[]) {
        return this.artistModel.find({ signature: { $in: signatures } })
    }

    public fetchArtists() {
        return this.artistModel.find({ status: { $in: this.PUBLIC_VIEW_ARTIST_STATUSES } })
    }

    public listNamesBySignatures(signatures: string[]): Promise<string[]> {
        return this.artistModel.distinct('name', { signature: { $in: signatures } })
    }

    public async updateArtistView(artist: ArtistViewDto, profile: JwtPayload) {
        const checkName = await this.artistModel.findOne({ $and: [
            { name: artist.name },
            { signature: { $ne: artist.signature } }
        ]}).select({ signature: true })
        if (checkName) {
            throw new MessageException('Artist name already in use')
        }
        const artistBefore = await this.artistModel.findOne({ signature: artist.signature })
        if (!artistBefore) {
            throw new NotFoundException()
        }
        if (artistBefore.signature !== profile.artistSignature) {
            throw new UnauthorizedException()
        }
        const newArtist = Object.assign(artistBefore, artist)

        if (newArtist.status === 'CREATED' && ArtistUtil.isViewReady(newArtist)) {
            this.msgToManager(newArtist)
            newArtist.status = 'READY'
        }

        newArtist.modified = new Date()
        const update = await this.artistModel.updateOne(
            { signature: newArtist.signature }, 
            { $set: newArtist }
        )

        if (!update?.modifiedCount) {
            this.logger.warn(`Not modified!`)
        }
        return newArtist
    }

    private async msgToManager(artist: Artist) {
        const profile = await this.profileService.findTelegramChannedId(artist.managerUid)
        if (profile?.telegramChannelId) {
            this.telegramService.sendMessage(Number(profile.telegramChannelId), BotUtil.msgFrom([
                `View of artist ${artist.name} is ready to be published`,
            ]))
        }
    }

    private prepareArtistSignature(name: string): string {
        const nameWithoutSpaces = name.replace(/\s+/g, '').toLowerCase();
        const initials = nameWithoutSpaces.split('').map((char, index) => {
            if (index === 0 || nameWithoutSpaces[index - 1] === nameWithoutSpaces[index - 1].toLowerCase()) {
                return char;
            }
            return '';
        }).join('');
        const timestamp = Date.now().toString(36); // Base-36 encoding to shorten
        const uniqueSignature = `${initials}${timestamp}`;
        return uniqueSignature;
    }

    public async processBookingForm(ctx: BookingSubmitCtx) {
        const artist: SelectorItem = FormUtil.get(ctx.booking.formData, 'artistInformation.artist')
        const artistSignatures = [artist.code]
        if (!artistSignatures?.length) {
            throw new IllegalStateException("Missing artist signatures")
        }
        this.logger.log(`Found artist signatures: ${artistSignatures.join(', ')}`)
        
        const artists = await this.artistModel.find({ signature: { $in: artistSignatures }}, { 
            signature: true, managerUid: true, name: true
        })

        if (artists.length !== artistSignatures.length) {
            throw new IllegalStateException(`Not found artists for booking ${ctx.booking.formId}`)
        }
        
        ctx.booking.artists = [artist]
        ctx.booking.managerUid = artists[0].managerUid
    }

    public async listMusicStyles(): Promise<ArtistStyle[]> {
        return this.artistModel.distinct('styles')
    }

    public listArtistLabels(): Promise<ArtistLabel[]> {
        return this.artistModel.distinct('labels')
    }

    public fetchArtistsOfManager(profile: JwtPayload) {
        return this.artistModel.find({ managerUid: profile.uid })
    }

    public async putManagementNotes(body: { managmentNotes: string, artistSignture: string }, profile: JwtPayload): Promise<void> {
        const update = await this.artistModel.updateOne(
            { signature: body.artistSignture, managerUid: profile.uid },
            { $set: { managmentNotes: body.managmentNotes } }
        )
        if (!update.modifiedCount) {
            throw new BadRequestException(`Not modified management notes for Artist: ${body.artistSignture} by manager: ${profile.uid}`)
        }
        this.logger.log(`Management notes put success for Artist: ${body.artistSignture} by manager: ${profile.uid}`)
    }

    public async setStatus(status: ArtistStatus, signature: string, profile: JwtPayload) {
        const update = await this.artistModel.updateOne({ signature, managerUid: profile.uid }, { $set: {
            status: status,
            modified: new Date()
        } })
        if (!update.modifiedCount) {
            this.logger.error(`Not modified status artist: ${signature}, by ${profile.uid}`)
            throw new NotFoundException()
        }
        this.logger.log(`Modified status ${status} artist: ${signature}, by ${profile.uid}`)
    }

    public getTimeline(artistSignature: string): Promise<{ timeline: TimelineItem[] }> {
        return this.artistModel.findOne({ signature: artistSignature }, { timeline: true })
    }

    public async submitTimelineEvent(artistSignature: string, event: TimelineItem, profile: JwtPayload): Promise<TimelineItem[]> {
        // TODO validate overlapse dates
        const authFilter = this.manageFilter(profile)
        const artist = await this.artistModel.findOne({
            $and: [authFilter, { signature: artistSignature }]
        }).exec()
        if (!artist) {
            throw new NotFoundException(`Not found Artist ${artistSignature} when trying to submit timeline event, ${profile.uid}`)
        }
        const timeline = artist.toObject().timeline || []

        const index = timeline.findIndex(item => item.id === event.id)
        
        if (index === -1) {
            event.id = uuidv4(),
            event.uid = profile.uid
            timeline.push(event)
        } else {
            timeline.splice(index, 1, event)
        }
        const update = await this.artistModel.updateOne({
            signature: artistSignature
        }, { $set: { timeline: timeline } })

        if (!update.modifiedCount) {
            throw new IllegalStateException(`Not modified ${artistSignature} when trying to submit timeline event, ${profile.uid}`)
        }
        this.logger.log(`Modified Artist ${artistSignature} timeline when trying to submit timeline event, ${profile.uid}`)
        return timeline
    }

    async removeTimelineEvent(artistSignature: string, id: string, profile: JwtPayload) {
        const authFilter = this.manageFilter(profile)
        const artist = await this.artistModel.findOne({
            $and: [authFilter, { signature: artistSignature }]
        }).exec()
        if (!artist) {
            throw new NotFoundException(`Not found Artist ${artistSignature} when trying to remove timeline event, ${profile.uid}`)
        }
        const timeline = artist.toObject().timeline || []

        const index = timeline.findIndex(item => item.id === id)
        
        if (index !== -1) {
            timeline.splice(index, 1)
        } else {
            throw new IllegalStateException(`Not modified ${artistSignature} when trying to remove timeline event, ${profile.uid}`)
        }
        const update = await this.artistModel.updateOne({
            signature: artistSignature
        }, { $set: { timeline: timeline } })
        this.logger.log(`Removed Artist ${artistSignature} timeline event, ${id}`)
        return timeline
    }

    private manageFilter(profile: JwtPayload): FilterQuery<Artist> {
        return profile.artistSignature 
        ? { signature: profile.artistSignature }
        : { managerUid: profile.uid }
    }

}
