import { CountriesService } from "./countries.service";
import { AbstractControl, ValidatorFn } from "@angular/forms";

export function countryValidator(countriesService: CountriesService): ValidatorFn {
    const countries = countriesService.getCountries().map(c => c.name)
    return (control: AbstractControl) => {
        if (!control.value?.label) {
            return { 'required' : true }
        }
        else if (countries.includes(control.value?.label)) {
            return null
        } else {
            return { 'country' : true }
        }
    }
  }