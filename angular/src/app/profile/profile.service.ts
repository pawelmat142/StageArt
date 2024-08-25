import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";
import { HttpService } from "../global/services/http.service";
import { Profile, ProfileDto, Role } from "./profile.model";
import { SelectorItem } from "../global/controls/selector/selector.component";
import { ManagerData } from "./view/manager-form/manager-form.component";

export interface LoginToken {
    token: string
    pin: string
}

export interface LoginForm {
    name: string
    role: SelectorItem
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

    fetchFullProfile$(): Observable<Profile> {
        return this.http.get<Profile>(`/profile/full`)
    }
    
    fetchManagers$(): Observable<ProfileDto[]> {
        return this.http.get<ProfileDto[]>(`/profile/managers`)
    }

    fetchManagerData$() {
        return this.http.get<ManagerData>(`/profile/manager-data`)
    }

    setManagerData$(form: ManagerData) {
        return this.http.put<ManagerData>(`/profile/manager-data`, form)
    }


    fetchTelegramBotHref$() {
        return this.http.get<{ url: string }>(`/profile/telegram`)
    }

    telegramPinRequest$(uidOrNameOrEmail: string) {
        return this.http.get<{ token: string }>(`/profile/telegram/pin/${uidOrNameOrEmail}`)
    }

    loginByPin$(loginToken: LoginToken): Observable<{ token: string }> {
        return this.http.post<{ token: string }>(`/profile/login/pin`, loginToken).pipe(
        )
    }

    refreshToken$(): Observable<{ token: string }> {
        return this.http.get<{ token: string }>(`/profile/refresh-token`)
    }

    createProfileEmail$(loginForm: LoginForm) {
        return this.http.post(`/profile/email/register`, loginForm)
    }

    loginByEmail$(loginForm: Partial<LoginForm>) {
        return this.http.post<{ token: string }>(`/profile/email/login`, loginForm)
    }

}