import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { Role } from "./profile.state";
import { HttpService } from "../global/services/http.service";

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


    fetchTelegramBotHref$() {
        return this.http.get<{ url: string }>(`/profile/telegram`)
    }

    telegramPinRequest$(uidOrNameOrEmail: string) {
        return this.http.get<{ token: string }>(`/profile/telegram/pin/${uidOrNameOrEmail}`)
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