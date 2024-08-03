import { Injectable } from "@angular/core";
import { HttpService } from "../http.service";
import { map, tap } from "rxjs";
import { LocalStorageService } from "../local-storage.service";
import { SelectorItem } from "../../pages/controls/selector/selector.component";
import { HttpClient } from "@angular/common/http";
import { Country, CountryResponseItem } from "./country.model";


export function initCountries(myService: CountriesService): () => void {
    return () => myService.initCountries()
}

@Injectable({
    providedIn: 'root'
})
export class CountriesService {

    constructor (
        private readonly httpClient: HttpClient,
        private readonly localStorageService: LocalStorageService,
    ) {
    }

    // APP_INITIALIZER
    public initCountries() {
        let countries = this.localStorageService.getCountries()
        if (!countries?.length) {
            this.fetchCountries$().subscribe()
        }
    }

    public getCountries(): Country[] {
        return this.localStorageService.getCountries() || []
    }

    public findByCode(countryCode: string): Country | undefined {
        return this.getCountries().find(c => c.code === countryCode)
    }


    private fetchCountries$() {
        return this.httpClient.get<CountryResponseItem[]>('https://restcountries.com/v3.1/all')
            .pipe(map(data => this.convert(data)))
            .pipe(map(countries => this.sortByAlphabet(countries)))
            .pipe(tap(countries => this.localStorageService.setCountries(countries)))
    }


    private convert(data: CountryResponseItem[]): Country[] {
        return this.filterMostCommonByPopulation(data).map(dataItem => {
            return {
                code: dataItem.cca2,
                name: dataItem.name.common,
                imgUrl: dataItem.flags.svg
            }
        })
    }

    private filterMostCommonByPopulation(data: CountryResponseItem[]): CountryResponseItem[] {
        data.sort((a, b) => b.population - a.population)
        return data.slice(0, 100)
    }

    private sortByAlphabet(countries: Country[]): Country[] {
        countries.sort((a, b) => a.code.localeCompare(b.code))
        return countries
    }

}