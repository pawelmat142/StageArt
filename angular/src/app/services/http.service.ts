import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { Observable, of, switchMap } from 'rxjs';

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
  ) { 
  }


  public get<T>(uri: string, auth = false) {
    return this.authHeader$(auth).pipe(
      switchMap(headers => {
        return this.httpClient.get<T>(`${this.apiUri}${uri}`, { headers: headers })
      })
    )
  }

  public post<T>(uri: string, data: any, auth = false) {
    return this.authHeader$(auth).pipe(
      switchMap(headers => this.httpClient.post<T>(`${this.apiUri}${uri}`, data, { headers: headers }))
    )
  }

  public put<T>(uri: string, data: any, auth = false) {
    return this.authHeader$(auth).pipe(
      switchMap(headers => this.httpClient.put<T>(`${this.apiUri}${uri}`, data, { headers: headers }))
    )
  }



  private authHeader$(auth: boolean): Observable<HttpHeaders | undefined> {
    // if (this.userSubject$.value && auth) {
    //     return from(this.userSubject$.value.getIdToken())
    //         .pipe(
    //             filter(token => typeof token === 'string'),
    //             map(token => new HttpHeaders({"Authorization": `Bearer ${token}`}))
    //         )
    // }
    return of(undefined)
  }


}
