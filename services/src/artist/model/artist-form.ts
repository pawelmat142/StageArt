import { Country } from "./artist.model"

export class ArtistForm {
    signature: string
    name: string
    country: Country
    firstName?: string
    lastName?: string
    email: string
    phone: string
    medias?: string[]
    avatarUrl: string
    imageUrls: string[]
    bio: string
}
