import { Injectable, Logger } from '@nestjs/common';
import { ArtistForm } from './model/artist-form';
import { Artist } from './model/artist.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ArtistService {

    private readonly logger = new Logger(this.constructor.name)

    constructor(
        @InjectModel(Artist.name) private artistModel: Model<Artist>,
    ) {}


    public async createArtist(artist: ArtistForm) {
        const newArtist = new this.artistModel({
            ...artist,
            signature: this.prepareArtistSignature(artist.name)
        })
        newArtist.active = true
        const saved = await newArtist.save()
        this.logger.warn(`Artist created, name: ${artist.name}, signature: ${artist.signature}`)
        return saved
    }

    public fetchArtist(name: string) {
        return this.artistModel.findOne({ name })
    }

    public fetchArtists() {
        return this.artistModel.find({ active: true })
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
}
