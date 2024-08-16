import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

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
  ) { }


  public get<T>(uri: string, params?: HttpParams) {
    const options = params ? { params } : {}
    return this.httpClient.get<T>(`${this.apiUri}${uri}`, options)
  }

  public post<T>(uri: string, data: any) {
    return this.httpClient.post<T>(`${this.apiUri}${uri}`, data)
  }

  public put<T>(uri: string, data: any) {
    return this.httpClient.put<T>(`${this.apiUri}${uri}`, data)
  }

}
