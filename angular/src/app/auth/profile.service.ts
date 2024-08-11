import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { HttpService } from "../services/http.service";

export interface LoginToken {
    token: string
    pin: string
}

@Injectable({
    providedIn: 'root'
})
export class ProfileService {

    constructor(
        private readonly http: HttpService,
    ) {}

    // TODO move to store
    // authHeader$(auth: boolean): Observable<HttpHeaders | undefined> {
    //     if (this.userSubject$.value && auth) {
    //         return from(this.userSubject$.value.getIdToken())
    //             .pipe(
    //                 filter(token => typeof token === 'string'),
    //                 map(token => new HttpHeaders({"Authorization": `Bearer ${token}`}))
    //             )
    //     }
    //     return of(undefined)
    // }

    fetchTelegramBotHref$() {
        return this.http.get<{ url: string }>(`/profile/telegram`)
    }


    loginByPin$(loginToken: LoginToken): Observable<{ token: string }> {
        return this.http.post<{ token: string }>(`/profile/login/pin`, loginToken).pipe(
            tap(console.log),
        )

    }


}