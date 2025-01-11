import { SelectorItem } from "../interface";

interface NativeName {
    official: string;
    common: string;
}

interface CountryResponseName {
    common: string;
    official: string;
    nativeName: {
        [key: string]: NativeName;
    };
}

interface Currency {
    name: string;
    symbol: string;
}

interface Idd {
    root: string;
    suffixes: string[];
}

interface Translation {
    official: string;
    common: string;
}

interface Demonyms {
    f: string;
    m: string;
}

interface Maps {
    googleMaps: string;
    openStreetMaps: string;
}

interface Car {
    signs: string[];
    side: string;
}

interface Flags {
    png: string;
    svg: string;
    alt: string;
}

interface CapitalInfo {
    latlng: number[];
}

export interface CountryResponseItem {
    name: CountryResponseName;
    tld: string[];
    cca2: string;
    ccn3: string;
    cca3: string;
    independent: boolean;
    status: string;
    unMember: boolean;
    currencies: {
        [key: string]: Currency;
    };
    idd: Idd;
    capital: string[];
    altSpellings: string[];
    region: string;
    languages: {
        [key: string]: string;
    };
    translations: {
        [key: string]: Translation;
    };
    latlng: number[];
    landlocked: boolean;
    area: number;
    demonyms: {
        eng: Demonyms;
    };
    flag: string;
    maps: Maps;
    population: number;
    car: Car;
    timezones: string[];
    continents: string[];
    flags: Flags;
    coatOfArms: {};
    startOfWeek: string;
    capitalInfo: CapitalInfo;
}

export interface Country extends SelectorItem {}
