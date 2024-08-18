import { ArtistMedia } from "../artist-medias/artist-medias.service"
import { Images } from "./artist-form"

export interface FetchArtistQuery {
    name?: string
    signature?: string
}

export interface Chip {
    name: string
    id: string
    class?: string
}

export interface ArtistStyle extends Chip {}

export interface ArtistLabel extends Chip {}

export type ArtistStatus = 'CREATED' | 'READY' | 'ACTIVE'

export interface ArtistViewDto {

    signature: string
    
    name: string

    status: ArtistStatus
    
    countryCode: string
    
    medias?: ArtistMedia[]
    
    images: Images
    
    bio: string

    styles: ArtistStyle[]

    labels: ArtistLabel[]
    
    managmentNotes: string
}