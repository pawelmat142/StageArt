import { SelectorItem } from "../../pages/controls/selector/selector.component"
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
}