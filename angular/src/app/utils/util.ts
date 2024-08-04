import { FormArray, FormControl, FormGroup } from "@angular/forms";

export abstract class Util {

    public static capitalizeFirstLetter(input: string = '') {
        if (input.length === 0) return input; // Return the empty string as-is
        return input.charAt(0).toUpperCase() + input.slice(1);
    }

    public static markForm(form: FormGroup | FormArray) {
        const controls = form.controls
        if (controls) {
            Object.values(controls).forEach(control => {
                if (control instanceof FormGroup) {
                    this.markForm(control)
                }
                else if (control instanceof FormArray) {
                    Object.values(control.controls).forEach(c => {
                        this.markForm(c as FormGroup)
                    })
                } 
                else {
                    control.markAsDirty()
                    control.markAsTouched()
                }
            })
        }
    }

    
}