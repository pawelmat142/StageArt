import { Injectable } from "@angular/core";
import { HttpService } from "../../../services/http.service";

@Injectable({
    providedIn: 'root'
})
export class FeedbackService {

    constructor(
        private readonly http: HttpService
    ) {}

    send$(value: string) {
        return this.http.post(`/feedback`, { value })
    }

}
