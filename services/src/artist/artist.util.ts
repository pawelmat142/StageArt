import { ArtistViewDto } from "./model/artist-view.dto";
import { Artist } from "./model/artist.model";

export abstract class ArtistUtil {

    public static isViewReady(artist: ArtistViewDto): boolean {
        return !!artist.name
            && !!artist.country.code
            && !!artist.bio
            && !!artist.medias?.length
            && this.imagesReadyForView(artist)
            && !!artist.styles.length
    }

    private static imagesReadyForView(artist: ArtistViewDto): boolean {
        const avatarSet = artist.images?.avatar
        if (avatarSet) {
            if (avatarSet.avatar && avatarSet.avatarMobile && avatarSet.mini) {
                const bgImgs = artist.images?.bg
                if (bgImgs) {
                    const bgImgSet = bgImgs[0]
                    if (bgImgSet) {
                        return bgImgSet.bg && bgImgSet.bgMobile && !!bgImgSet.avatar
                    }
                }
            }
        }
        return false
    }

    public static artistNames(artists: Artist[]): string {
        return artists.map(a => a.name).join(', ')
    }
}