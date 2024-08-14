import { CountriesService } from "./countries.service";
import { AbstractControl, ValidatorFn } from "@angular/forms";

export function countryValidator(countriesService: CountriesService): ValidatorFn {
    const countries = countriesService.getCountries().map(c => c.code)
    return (control: AbstractControl) => {
        if (!control.value?.code) {
            return { 'required' : true }
        }
        else if (countries.includes(control.value?.code)) {
            return null
        } else {
            return { 'country' : true }
        }
    }
  }