import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Artist, ArtistStatus } from './model/artist.model';
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

@Injectable()
export class ArtistService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        @InjectModel(Artist.name) private artistModel: Model<Artist>,
        private readonly profileService: ProfileService,
    ) {}


    // TODO status READY temporary here!
    private readonly PUBLIC_VIEW_ARTIST_STATUSES: ArtistStatus[] = [ 'ACTIVE', 'READY' ]

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
            modified: new Date(),
            managerUid: form.manager,
        })

        const update = await this.profileService.updateArtistProfile(form, profile, newArtist.signature)
        if (!update.modifiedCount) {
            throw new IllegalStateException(`Artist profile update error, uid: ${profile.uid}`)
        }
        this.logger.log(`Updated profile via created Artist entity`)

        newArtist.status = 'CREATED'
        const saved = await newArtist.save()
        this.logger.warn(`Artist created, name: ${newArtist.name}, signature: ${newArtist.signature}`)
        return newArtist
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
            .select({ name: true})
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
            signature: true, bookings: true, managerUid: true
        })
        
        if (!artists?.length) {
            throw new IllegalStateException("Artists not found")
        }
        
        booking.artistSignatures = artistSignatures
        booking.artistNames = artists.map(a => a.name)

        // TODO!
        // booking.managerUid = artist.managerUid

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
