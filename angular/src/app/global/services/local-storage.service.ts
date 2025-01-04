import { Injectable } from "@angular/core";
import { Country } from "../countries/country.model";
import { AppState } from "../../app.state";
import { Store } from "@ngrx/store";
import { selectFormId } from "../../form-processor/form.state";

@Injectable({
    providedIn: 'root'
})
export class LocalStorageService {

    private readonly COUNTIRES = "COUNTIRES"

    constructor(
        private readonly store: Store<AppState>,
    ) {
        this.store.select(selectFormId).subscribe(id => console.log(`formId: ${id}`))
    }


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