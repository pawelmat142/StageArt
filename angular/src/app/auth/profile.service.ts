import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { HttpService } from "../services/http.service";
import { Role } from "./profile.state";

export interface LoginToken {
    token: string
    pin: string
}

export interface LoginForm {
    name: string
    role: Role
    email: string
    password: string
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


    createProfileEmail$(loginForm: LoginForm) {
        return this.http.post(`/profile/email/register`, loginForm)
    }

    loginByEmail$(loginForm: Partial<LoginForm>) {
        return this.http.post<{ token: string }>(`/profile/email/login`, loginForm)
    }

}