import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private readonly apiUri = location.hostname === 'localhost' ? environment.testApiUri : environment.apiUri

  constructor(
    private readonly httpClient: HttpClient
  ) { }


  public get<T>(uri: string) {
    return this.httpClient.get<T>(uri)
  }

  public post<T>(uri: string, data: any) {
    return this.httpClient.post<T>(`${this.apiUri}${uri}`, data)
  }


  public test(): Observable<unknown> {
    return this.httpClient.get(`${this.apiUri}`)
  }

  
}
