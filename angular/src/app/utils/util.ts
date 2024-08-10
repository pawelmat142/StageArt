import { FormArray, FormControl, FormGroup } from "@angular/forms";

export abstract class Util {

    public static capitalizeFirstLetter(input: string = '') {
        if (input.length === 0) return input; // Return the empty string as-is
        return input.charAt(0).toUpperCase() + input.slice(1);
    }

}