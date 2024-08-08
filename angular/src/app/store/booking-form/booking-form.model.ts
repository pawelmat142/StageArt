import { DatePeriod } from "../../pages/controls/dates/dates.component";
import { Country } from "../../services/countries/country.model";

export interface BookingForm {

    id: string

    eventDetails?: EventDetails

    artistsDetails?: ArtistDetails[]

    contactDetails?: ContactDetails
}

export interface EventDetails {
    datePeriod: DatePeriod;
    name: string;
    country: Country;
    locationInfo?: string;
    eventUrl?: string;
    timetable?: string;
}

export interface ArtistDetails {
    artist: string | null;
    offerNotes: string;
    stageTime: string;
}

export interface ContactDetails {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    telegram: string;
}