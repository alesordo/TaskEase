import { Injectable } from '@angular/core';
import {WebRequestService} from "./web-request.service";
import {Router} from "@angular/router";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {shareReplay, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  readonly ROOT_URL;

  constructor(private http: HttpClient, private webReqService: WebRequestService, private router: Router) {
    this.ROOT_URL = webReqService.ROOT_URL;
  }

  login(email: string, password: string){
    return this.http.post(`${this.ROOT_URL}/users/login`, {
      email,
      password
    }, {
      observe: 'response'
    }).pipe(
      // No multiple subscribers to execute this method
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        // The auth tokens will be in the header of this response -checking if they're strings present, otherwise fail
        let accessToken = res.headers.get('x-access-token');
        let refreshToken = res.headers.get('x-refresh-token');

        if (accessToken && refreshToken) {
          this.setSession(res.body._id, accessToken, refreshToken);
          console.log("Logged in!");
        }
      })
    );
  }

  logout(){
    this.removeSession();
  }

  getAccessToken(){
    return localStorage.getItem('x-access-token');
  }

  getRefreshToken(){
    return localStorage.getItem('x-refresh-token');
  }

  setAccessToken(accessToken: string){
    localStorage.setItem('x-access-token', accessToken);
  }

  private setSession(userId: string, accessToken: string, refreshToken: string){
    localStorage.setItem('user-id', userId);
    localStorage.setItem('access-token', accessToken);
    localStorage.setItem('refresh-token', refreshToken);
  }

  private removeSession(){
    localStorage.removeItem('user-id');
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
  }
}
