import { Injectable } from "@angular/core";
import { HttpService } from "../http.service";
import { map, tap } from "rxjs";
import { LocalStorageService } from "../local-storage.service";

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
}

interface CapitalInfo {
    latlng: number[];
}

interface CountryResponseItem {
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

export interface Country {
    name: string
    flagUrl: string
}

@Injectable({
    providedIn: 'root'
})
export class CountriesService {

    constructor(
        private readonly http: HttpService,
        private readonly localStorageService: LocalStorageService,
    ) {
        this.initCountries()
    }

    public getCountries(): Country[] {
        return this.localStorageService.getCountries() || []
    }

    private initCountries() {
        let countries = this.localStorageService.getCountries()
        if (!countries?.length) {
            this.fetchCountries()
        }
    }


    private fetchCountries() {
        return this.http.get<CountryResponseItem[]>('https://restcountries.com/v3.1/all')
            .pipe(map(data => this.convert(data)))
            .pipe(map(countries => this.sortByAlphabet(countries)))
            .pipe(tap(countries => this.localStorageService.setCountries(countries)))
    }


    private convert(data: CountryResponseItem[]): Country[] {
        return this.filterMostCommonByPopulation(data).map(dataItem => {
            return {
                name: dataItem.name.common,
                flagUrl: dataItem.flags.svg
            }
        })
    }

    private filterMostCommonByPopulation(data: CountryResponseItem[]): CountryResponseItem[] {
        data.sort((a, b) => b.population - a.population)
        return data.slice(0, 100)
    }

    private sortByAlphabet(countries: Country[]): Country[] {
        countries.sort((a, b) => a.name.localeCompare(b.name))
        return countries
    }

}