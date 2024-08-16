import { ArtistMedia } from "../artist-medias/artist-medias.service"
import { Images } from "./artist-form"

export interface FetchArtistQuery {
    name?: string
    signature?: string
}

export type ArtistStatus = 'CREATED' | 'READY' | 'ACTIVE'

export interface MusicStyle {
    order: number
    id: string
    name: string
}

export interface ArtistViewDto {

    signature: string
    
    name: string

    status: ArtistStatus
    
    countryCode: string
    
    medias?: ArtistMedia[]
    
    images: Images
    
    bio: string

    style: MusicStyle[]
    
    managmentNotes: string
}