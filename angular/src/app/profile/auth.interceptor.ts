import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Token } from "./auth/view/token";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor() {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${Token.token}`
          }
        });
        return next.handle(authReq);
      }

}