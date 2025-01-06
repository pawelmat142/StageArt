import { FormArray, FormControl, FormGroup } from "@angular/forms";
import { pFormControl } from "../../form-processor/form-processor.service";

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
        if (!data) {
            formGroup.reset()
            return
        }
        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key)
            const controlData = data[key]
            if (control instanceof FormArray) {
                if (Array.isArray(controlData)) {
                    control.controls.forEach((ctrl, i) => {
                        if (ctrl instanceof FormGroup) {
                            let groupData = controlData[i]
                            if (groupData) {
                                ctrl.setValue(groupData)
                            }
                        }

                    })
                }
            } else if (control instanceof FormControl) {
                if (controlData) {
                    this.setControlValue(control, controlData)
                }
            } else if (control instanceof FormGroup) {
                if (controlData) {
                    this.setFormValues(control, controlData)
                }
            } 
            
        })
    }

    private static setControlValue(control: FormControl, value: any) {
        const date = new Date(value)
        if (!isNaN(date.getTime())) {
            control.setValue(date)
        } else {
            control.setValue(value)
        }
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