import { AbstractControl, ValidatorFn } from "@angular/forms";
import { artistMediaCodes } from "./artist-medias.service";

export function mediaValidator(): ValidatorFn {

    return (control: AbstractControl) => {
        if (!control.value?.code) {
            return { 'required' : true }
        }
        else if (artistMediaCodes.includes(control.value?.code)) {
            return null
        } else {
            return { 'mediaType' : true }
        }
    }
  }