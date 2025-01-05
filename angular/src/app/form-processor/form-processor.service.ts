import { Injectable } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { Form, FormType } from './form.state';
import { HttpService } from '../global/services/http.service';
import { SelectorItem } from '../global/interface';

export type pControlType = 'text' | 'textarea' | 'date' | 'selector'

export interface pForm {
  type: FormType
  name: string
  steps: pFormStep[]
}

export type pFormStep = pFormGroup | pFormArray

export interface pFormGroup {
  array?: false
  name: string
  controls: pFormControl[]
}


export interface pFormArray {
  array: true
  name: string
  groups: pFormGroup[],
  getGroup: (index: number) => pFormGroup
}

export interface pFormControl {
  name: string
  type?: pControlType,
  placeholder?: string
  required?: boolean
  validators?: ValidatorFn[]
  selectorItems$?: Observable<SelectorItem[]>
  date?: {
    min?: Date,
    disabledDays?: Observable<Date[]>,
  }
}

@Injectable({
  providedIn: 'root'
})
export class FormProcessorService {

  constructor(
    private readonly http: HttpService
  ) { }

  fetchSubmitted$(formType: string) {
    return this.http.get<Form[]>(`/form/submitted/${formType}`)
  }

  openForm$(id: string): Observable<Form> {
    return this.http.get<Form>(`/form/open/${id}`)
  }

  startForm$(form: Form): Observable<{ formId: string }> {
    return this.http.post<{ formId: string }>(`/form/start/${form.formType}`, form.data)
    .pipe(tap(id => {
      localStorage.setItem(form.formType, id.formId)
    }))
  }

  storeForm$(form: Form): Observable<void> {
    return this.http.put<void>(`/form/store/${form.id}`, form.data)
  }

}
