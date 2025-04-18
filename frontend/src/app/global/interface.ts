import { ArtistMediaCode } from "../artist/artist-medias/artist-medias.service"

export interface SelectorItem {
    name: string
    code: string
    imgUrl?: string
    imgAlt?: string
    svg?: ArtistMediaCode
}