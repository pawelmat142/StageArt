import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Artist, ArtistLabel, ArtistStatus, ArtistStyle } from './model/artist.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Booking } from '../booking/model/booking.model';
import { BookingFormProcessor } from '../booking/util/booking-form-processor';
import { IllegalStateException } from '../global/exceptions/illegal-state.exception';
import { ArtistViewDto } from './model/artist-view.dto';
import { JwtPayload } from '../profile/auth/jwt-strategy';
import { ArtistUtil } from './artist.util';
import { ArtistForm, FetchArtistQuery } from './artist.controller';
import { ProfileService } from '../profile/profile.service';
import { TelegramService } from '../telegram/telegram.service';
import { BotUtil } from '../telegram/util/bot.util';

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
            throw new IllegalStateException(`Artist name taken`)
        }

        const newArtist = new this.artistModel({
            signature: this.prepareArtistSignature(form.artistName),
            name: form.artistName,
            status: 'CREATED',
            images: { bg: [], avatar: {} },
            created: new Date(),
            managerUid: form.manager,
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
        return this.artistModel.findOne({ signature })
    }

    public fetchArtists() {
        return this.artistModel.find({ status: { $in: this.PUBLIC_VIEW_ARTIST_STATUSES } })
    }

    public findName(signature: string) {
        return this.artistModel.findOne({ signature })
            .select({ name: true })
    }

    public async updateArtistView(artist: ArtistViewDto, profile: JwtPayload) {
        const checkName = await this.artistModel.findOne({ $and: [
            { name: artist.name },
            { signature: { $ne: artist.signature } }
        ]}).select({ signature: true })
        if (checkName) {
            throw new IllegalStateException('Artist name already in use')
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
                `View of artist ${artist.name} is ready,`,
                `You can publish it now`
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

    public async processBookingForm(booking: Partial<Booking>) {
        const artistSignatures = BookingFormProcessor.findArtistSignatures(booking.formData)
        if (!artistSignatures?.length) {
            throw new IllegalStateException("Missing artist signatures")
        }
        this.logger.log(`Found artist signatures: ${artistSignatures.join(', ')}`)
        
        const artists = await this.artistModel.find({ signature: { $in: artistSignatures }}, { 
            signature: true, bookings: true, managerUid: true
        })
        
        if (!artists?.length) {
            throw new IllegalStateException("Artists not found")
        }
        
        booking.artistSignatures = artistSignatures
        booking.managerUid = artists[0].managerUid

        const artistBooking = {
            ...booking
        }
        delete artistBooking.formData

        for (let artist of artists) {
            await this.processBookingFormPerArtist(booking, artist)
        }
    }

    private async processBookingFormPerArtist(booking: Partial<Booking>, artist: Partial<Artist>) {
        artist.bookings.push({
            ...booking,
            formData: null
        })
        const update = await this.artistModel.updateOne(
            { signature: artist.signature }, 
            { $set: { bookings: artist.bookings, modified: new Date() } }
        )
        if (!update?.matchedCount) {
            throw new IllegalStateException(`Not modified Artist ${artist.signature} when process Booking ${booking.formId}`)
        }
        this.logger.log(`Processed booking ${booking.formId} for artist ${artist.signature}`)
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

}
