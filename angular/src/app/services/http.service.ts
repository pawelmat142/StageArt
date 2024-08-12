import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { catchError, filter, map, Observable, of, switchMap } from 'rxjs';
import { AppState, selectProfileState } from '../store/app.state';
import { Store } from '@ngrx/store';
import { Token } from '../auth/token';
import { NavService } from './nav/nav.service';
import { DialogService } from './nav/dialogs/dialog.service';
import { loggedInChange } from '../auth/profile.state';

export interface HttpRequestOptions {
  // skipAuth?: boolean
  headers?: HttpHeaders | { [header: string]: string | string[] };
  context?: HttpContext;
  observe?: 'body';
  params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
  reportProgress?: boolean;
  responseType?: 'json' | 'blob';
  withCredentials?: boolean;
  transferCache?: { includeHeaders?: string[] } | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private readonly apiUri = ['localhost', '127.0.0.1'].includes(location.hostname) ? environment.testApiUri : environment.apiUri

  constructor(
    private readonly httpClient: HttpClient,
    private readonly store: Store<AppState>,
    private readonly nav: NavService,
    private readonly dialog: DialogService,
  ) { }


  public get<T>(uri: string) {
    return this.httpClient.get<T>(`${this.apiUri}${uri}`)
  }

  public post<T>(uri: string, data: any) {
    return this.httpClient.post<T>(`${this.apiUri}${uri}`, data)
  }

  public put<T>(uri: string, data: any) {
    return this.httpClient.put<T>(`${this.apiUri}${uri}`, data)
  }



}
