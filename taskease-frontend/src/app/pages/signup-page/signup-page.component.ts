import { Component } from '@angular/core';
import {HttpResponse} from "@angular/common/http";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent {
  constructor(private authService: AuthService) {
  }

  onSignupButtonClicked(email: string, password: string){
    this.authService.signup(email, password).subscribe((res: HttpResponse<any>) => {
      console.log(res);
    });
  }
}
