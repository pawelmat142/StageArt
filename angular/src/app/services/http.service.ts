import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs';

export interface HttpRequestOptions {
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

  private readonly apiUri = location.hostname === 'localhost' ? environment.testApiUri : environment.apiUri

  constructor(
    private readonly httpClient: HttpClient
  ) { }


  public get<T>(uri: string, options?: HttpRequestOptions) {
    return this.httpClient.get<T>(`${this.apiUri}${uri}`)
  }

  public post<T>(uri: string, data: any, options?: HttpRequestOptions) {
    return this.httpClient.post<T>(`${this.apiUri}${uri}`, data)
  }


  public test(): Observable<unknown> {
    return this.httpClient.get(`${this.apiUri}`)
  }

  
}
