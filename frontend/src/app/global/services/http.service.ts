import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Util } from '../utils/util';

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

  private readonly apiUri = Util.apiUri

  constructor(
    private readonly httpClient: HttpClient,
  ) { }


  public get<T>(uri: string, params?: HttpParams) {
    const options = params ? { params } : {}
    return this.httpClient.get<T>(`${this.apiUri}${uri}`, options)
  }

  public post<T>(uri: string, data?: any) {
    return this.httpClient.post<T>(`${this.apiUri}${uri}`, data)
  }

  public put<T>(uri: string, data?: any) {
    return this.httpClient.put<T>(`${this.apiUri}${uri}`, data)
  }

  public delete<T>(uri: string) {
    return this.httpClient.delete<T>(`${this.apiUri}${uri}`)
  }

}
