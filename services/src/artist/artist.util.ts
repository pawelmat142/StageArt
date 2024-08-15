import { ArtistViewDto } from "./model/artist-view.dto";

export abstract class ArtistUtil {

    public static isViewReady(artist: ArtistViewDto): boolean {
        return !!artist.name
            && !!artist.countryCode
            && !!artist.bio
            && !!artist.medias?.length
            && this.imagesReadyForView(artist)
    }

    private static imagesReadyForView(artist: ArtistViewDto): boolean {
        const avatarSet = artist.images?.avatar
        if (avatarSet) {
            if (avatarSet.avatar && avatarSet.mini) {
                const bgImgs = artist.images?.bg
                if (bgImgs) {
                    const bgImgSet = bgImgs[0]
                    if (bgImgSet) {
                        return bgImgSet.bg && !!bgImgSet.miniBg
                    }
                }
            }
        }
        return false
    }
}