import { Injectable } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { SelectorItem } from '../pages/controls/selector/selector.component';
import { Observable, of, tap } from 'rxjs';
import { Form, FormType } from './form.state';
import { HttpService } from '../services/http.service';

export type pControlType = 'text' | 'textarea' | 'period' | 'selector'

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
  type: pControlType,
  placeholder?: string
  required?: boolean
  validators?: ValidatorFn[]
  getSelectorItems?: () => SelectorItem[]
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

  startForm$(form: Form): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`/form/start/${form.formType}`, form.data)
    .pipe(tap(id => {
      localStorage.setItem(form.formType, id.id)
    }))
  }

  storeForm$(form: Form): Observable<void> {
    return this.http.put<void>(`/form/store/${form.id}`, form.data)
  }

  submitForm$(form: Form): Observable<void> {
    return this.http.put<void>(`/form//${form.id}`, form.data)
    .pipe(tap(_ => {
      localStorage.removeItem(form.formType)
    }))
  }

}
