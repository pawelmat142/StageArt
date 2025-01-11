import { Injectable } from "@angular/core";
import { Country } from "../countries/country.model";

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    private readonly COUNTIRES = "COUNTIRES"

    public setCountries(countries: Country[]) {
        this.setItem(this.COUNTIRES, countries)
    }

    public getCountries(): Country[] | null {
        return this.getItem<Country[]>(this.COUNTIRES)
    }


    public setItem(key: string, value: any): void {
        localStorage.setItem(key, JSON.stringify(value))
    }

    public getItem<T>(key: string): T | null{
        const item = localStorage.getItem(key);
        return item ? (JSON.parse(item) as T) : null;
    }

    public removeItem(key: string) {
        localStorage.removeItem(key)
    }

}