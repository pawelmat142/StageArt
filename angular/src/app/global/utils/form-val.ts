import { FormArray, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { pFormControl } from "../../form-processor/form-processor.service";

export abstract class FormVal {

    private static readonly phoneNumberRegex = /^\+?(\d{1,4})?[-. ]?(\(?\d+\)?)?[-. ]?\d+[-. ]?\d+[-. ]?\d+$/;

    public static phoneValidator(): ValidatorFn {
        return () => Validators.pattern(this.phoneNumberRegex)
    }

}