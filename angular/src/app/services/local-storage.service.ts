import { Injectable } from "@angular/core";
import { Country } from "./countries/countries.service";

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    private readonly COUNTIRES = "COUNTIRES"


    constructor() {}


    public setCountries(countries: Country[]) {
        this.setItem(this.COUNTIRES, countries)
    }

    public getCountries(): Country[] | null {
        return this.getItem<Country[]>(this.COUNTIRES)
    }


    private setItem(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value))
    }

    private getItem<T>(key: string): T | null{
        const item = localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : null;
    }


    // public 

}