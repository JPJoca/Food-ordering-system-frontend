import { Component } from '@angular/core';
import {TokenType} from "@angular/compiler";
import {TokenService} from "../../service/token.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Web3Front';
  protected readonly localStorage = localStorage;

  constructor(private tokenservice:TokenService) {
  }

  logout(){
    this.tokenservice.removeToken();
  }
}
