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
        const newArtist = new this.artistModel(artist)
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

}
