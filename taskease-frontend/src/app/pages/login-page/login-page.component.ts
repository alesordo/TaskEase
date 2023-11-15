import { Component } from '@angular/core';
import {AuthService} from "../../auth.service";
import {HttpResponse} from "@angular/common/http";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent {
  constructor(private authService: AuthService) {
  }
  onLoginButtonClicked(email: string, password: string){
    this.authService.login(email, password).subscribe((res: HttpResponse<any>) => {
      console.log(res);
    });
  }
}
