import { Injectable } from '@angular/core';
import {HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, EMPTY, empty, Observable, Subject, switchMap, tap, throwError} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class WebReqInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  refreshingAccessToken : boolean;

  accessTokenRefreshed: Subject<any> =  new Subject();

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // Handle the request
    request = this.addAuthHeader(request);

    // Call next() and handle the response
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);

        if(error.status === 401){
          // 401 error, so unauthorised

          console.log("ciao");

          // Refresh the access token
          return this.refreshAccessToken()
            .pipe(
              switchMap(() => {
                request = this.addAuthHeader(request);
                return next.handle(request);
              }),
              catchError((err: any) => {
                console.log(err);
                this.authService.logout();
                return EMPTY;
              })
            )
        }

        return throwError(() => error);
      }))
  }

  refreshAccessToken(){
    if(this.refreshingAccessToken){
      return new Observable(observer => {
        this.accessTokenRefreshed.subscribe(() => {
          // This code will run when the access token has been refreshed
          observer.next();
          observer.complete();
        })
      })
    }
    else {
      this.refreshingAccessToken = true;
      // Calling a method in the auth service to send a request to refresh the access token
      return this.authService.getNewAccessToken().pipe(
        tap(() => {
          this.refreshingAccessToken = false;
          console.log("Access token refreshed");
          // @ts-ignore
          this.accessTokenRefreshed.next();
        })
      )
    }

  }

  addAuthHeader(request: HttpRequest<any>){
    // Get the access token
    const token = this.authService.getAccessToken();

    if(token){
      // Append the access token to the request header
      return request.clone({
        setHeaders: {
          'x-access-token' : token
        }
      })
    }
    return request;
  }
}
