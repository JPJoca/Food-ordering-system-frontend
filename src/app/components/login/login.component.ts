import { Component } from '@angular/core';
import {ApiService} from "../../service/api.service";
import {TokenService} from "../../service/token.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  constructor(private apiService:ApiService,private tokenService:TokenService,private router: Router) {}

  onSubmit() {
    if(this.email == '' || this.password == ''){
      alert('Unesite email i lozinku');
      return;
    }

    this.apiService.login(this.email,this.password).subscribe(
      result => {
        this.tokenService.setToken(result.token)
        this.router.navigate(['/'])
      },
      error => {
        console.error("Došlo je do greške ", error);
        alert("Došlo je do greške. Pokušajte ponovo. ");
      }
    );
  }
}
