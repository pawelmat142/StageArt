import { SelectorItem } from "../global/interface"
import { $desktop } from "../global/tools/media-query"
import { Images } from "./model/artist-form"
import { ArtistViewDto } from "./model/artist-view.dto"

export abstract class ArtistUtil {

    public static selectorItems(artists: ArtistViewDto[]): SelectorItem[] {
        return artists.map(a => {
            return {
                code: a.signature,
                name: a.name,
                imgUrl: a.images.avatar?.mini?.url
            }
        })
    }

    public static avatarUrl(images?: Images): string {
        if (!images) {
            return ''
        }
        const url = $desktop 
            ? images.avatar?.avatar?.url
            : images.avatar?.avatarMobile?.url 

        return url || ''
    }
}