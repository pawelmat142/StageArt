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

//status READY when all mandatory view fields are filled, 
//status ACTIVE when manager accepts an Artist -> artist view is published
//status INACTIVE when manager or artist deactivate account -> artist view is not published anymore
export type ArtistStatus = 'CREATED' | 'READY' | 'ACTIVE' | 'INACTIVE'

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