import { Country } from "../artist/model/artist.model"
import { Util } from "../global/utils/util"
import { JwtPayload } from "../profile/auth/jwt-strategy"
import { Profile } from "../profile/model/profile.model"
import { COUNTRIES } from "./data/countries"

export abstract class Gen {

    public static readonly PHONE_NUMBER = `+48 600 123 456`


    public static dotCom(name: string): string {
        return `${Util.toKebabCase(name)}@test`
    }

    public static toJwtProfile(profile: Profile) {
        return {
            uid: profile.uid,
            name: profile.name,
            roles: profile.roles,
        } as JwtPayload
    }

    public static randomCountry(): Country {
        const countries = COUNTRIES
        const randomIndex = Math.floor(Math.random() * countries.length);
        return countries[randomIndex];
    }

    public static getRandomParagraphs(paragraphs?: number) {
        const arr = this.paragraphs
        const numElements = paragraphs || Math.floor(Math.random() * (arr.length - 1)) + 1; // Random number between 1 and arr.length - 1
        const shuffledArr = [...arr].sort(() => Math.random() - 0.5); // Shuffle the array
        return shuffledArr.slice(0, numElements);
    }

    private static readonly paragraphs: string[] = [
        `Lorem Ipsum is simply dummy text of the printing and typesetting industry.`,
        `Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
        `It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.`,
        `It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,
        `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.`,
        `The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.`,
        `Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.`,
        `Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).`,
        `The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.`
    ]
}