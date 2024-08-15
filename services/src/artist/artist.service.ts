import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ArtistForm } from './model/artist-form';
import { Artist, ArtistStatus } from './model/artist.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Booking } from '../booking/model/booking.model';
import { BookingFormProcessor } from '../booking/util/booking-form-processor';
import { IllegalStateException } from '../global/exceptions/illegal-state.exception';
import { Profile } from '../profile/model/profile.model';
import { ArtistViewDto } from './model/artist-view.dto';
import { JwtPayload } from '../profile/auth/jwt-strategy';
import { ArtistUtil } from './artist.util';

@Injectable()
export class ArtistService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        @InjectModel(Artist.name) private artistModel: Model<Artist>,
    ) {}


    // TODO status READY temporary here!
    private readonly PUBLIC_VIEW_ARTIST_STATUSES: ArtistStatus[] = [ 'ACTIVE', 'READY' ]


    public async createPlainArtist(profile: Profile): Promise<Artist> {
        const plainArtist = new this.artistModel({
            signature: this.prepareArtistSignature(profile.name),
            name: profile.name,
            status: 'CREATED',
            images: { bg: [], avatar: {} },
            created: new Date(),
            modified: new Date(),
        })
        await plainArtist.save()
        this.logger.log(`Created artist from profile ${profile.uid}`)
        return plainArtist
    }

    // deprecated
    public async createArtist(artist: ArtistForm) {
        const newArtist = new this.artistModel({
            ...artist,
            signature: this.prepareArtistSignature(artist.name)
        })
        newArtist.status = 'CREATED'
        const saved = await newArtist.save()
        this.logger.warn(`Artist created, name: ${artist.name}, signature: ${artist.signature}`)
        return saved
    }

    public fetchArtist(name: string) {
        return this.artistModel.findOne({ name })
    }

    public fetchArtists() {
        return this.artistModel.find({ status: { $in: this.PUBLIC_VIEW_ARTIST_STATUSES } })
    }

    public findName(signature: string) {
        return this.artistModel.findOne({ signature })
            .select({ name: true})
    }

    public async updateArtistView(artist: ArtistViewDto, profile: JwtPayload) {
        const artistBefore = await this.artistModel.findOne({ signature: artist.signature})
        if (!artistBefore) {
            throw new NotFoundException()
        }
        if (artistBefore.signature !== profile.artistSignature) {
            throw new UnauthorizedException()
        }
        const newArtist = Object.assign(artistBefore, artist)

        if (ArtistUtil.isViewReady(newArtist)) {
            newArtist.status = 'READY'
        }

        const update = await this.artistModel.updateOne({ signature: newArtist.signature }, { $set: newArtist })

        if (!update?.modifiedCount) {
            this.logger.warn(`Not modified!`)
        }
        return newArtist
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
            signature: true, bookings: true
        })
        
        if (!artists?.length) {
            throw new IllegalStateException("Artists not found")
        }
        
        booking.artistSignatures = artistSignatures
        booking.artistNames = artists.map(a => a.name)

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
        await this.artistModel.updateOne({ signature: artist.signature}, {
            $set: { bookings: artist.bookings }
        })
        this.logger.log(`Processed booking ${booking.formId} for artist ${artist.signature}`)
    }
}
