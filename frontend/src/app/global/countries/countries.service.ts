import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, Observable, of, retry, tap } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Country, CountryResponseItem } from "./country.model";
import { LocalStorageService } from "../services/local-storage.service";
import { Dialog } from "../nav/dialog.service";


export function initCountries(countriesService: CountriesService): () => void {
    return () => countriesService.initCountries()
}

@Injectable({
    providedIn: 'root'
})
export class CountriesService {

    constructor (
        private readonly httpClient: HttpClient,
        private readonly dialog: Dialog,
        private readonly localStorageService: LocalStorageService,
    ) {
    }

    // APP_INITIALIZER
    public initCountries() {
        let countries = this.localStorageService.getCountries()
        if (!countries?.length) {
            this.fetchCountries$().subscribe()
        } else {
            this.countriesSubject$.next(countries)
        }
    }

    private countriesSubject$ = new BehaviorSubject<Country[]>([])
    public get countries$(): Observable<Country[]> {
        return this.countriesSubject$.asObservable()
    }
    public get countries(): Country[] {
        return this.countriesSubject$.value
    }

    public findByCode(countryCode: string): Country | undefined {
        return this.countries.find(c => c.code === countryCode)
    }


    private fetchCountries$() {
        return this.httpClient.get<CountryResponseItem[]>('https://restcountries.com/v3.1/all').pipe(
            retry(8),
            map(data => this.convert(data)),
            map(countries => this.sortByAlphabet(countries)),
            tap(countries => this.countriesSubject$.next(countries)),
            tap(countries => this.localStorageService.setCountries(countries)),
            catchError((error) => this.handleError(error)),
        )
    }

    private handleError(error: any) {
        console.log(error)
        this.dialog.warnToast(`Initialization failed`)
        return of()
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