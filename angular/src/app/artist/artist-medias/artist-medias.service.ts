import { Injectable } from "@angular/core";

export const artistMediaCodes = [
    '', 
    'facebook', 
    'instagram', 
    'soundcloud', 
    'bandcamp',
    'website'
] as const

export type ArtistMediaCode = typeof artistMediaCodes[number]

export interface ArtistMedia {
    code: ArtistMediaCode,
    url: string
}

@Injectable({
    providedIn: 'root'
})
export class ArtistMediasService {

    constructor() {}

    public getMedias(): ArtistMediaCode[] {
        return artistMediaCodes as unknown as ArtistMediaCode[]
    }

}