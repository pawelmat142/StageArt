import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { pFormControl } from "../form-processor/form-processor.service";

export abstract class FormUtil {

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

    public static setFormValues(formGroup: FormGroup, data: any) {
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key)
            const controlData = data[key]
            if (control instanceof FormArray) {
                if (Array.isArray(controlData)) {
                    control.controls.forEach((ctrl, i) => {
                        if (ctrl instanceof FormGroup) {
                            const ctrlData = controlData[i]
                            if (ctrlData) {
                                ctrl.setValue(ctrlData)
                            }
                        }

                    })
                }
            } else if (control instanceof FormGroup) {
                if (controlData) {
                    control.setValue(controlData)
                }
            } 
            
        })
    }

    public static prepareFormControl(control: pFormControl): FormControl {
        if (!control.type || ['text', 'textarea'].includes(control.type)) {
          return new FormControl('', control.validators)
        }
        if (control.type === 'date') {
          return new FormControl<Date | null>(null, control.validators)
        }
        if (control.type === 'selector') {
          return new FormControl<any>(null, control.validators)
        }
        throw new Error(`Unknown control type: ${control.type}`)
      }


    public static toCamelCase(str: string): string {
        return str
            .toLowerCase()
            .split(' ')
            .map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
            .join('');
    }
}