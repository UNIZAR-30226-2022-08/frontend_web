import { Component } from "@angular/core";
import { Router } from "@angular/router";
import axios from 'axios';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent {
  email: string;
  password: string;

  constructor(public router: Router) {}

  login() {
    console.log(this.email);
    console.log(this.password);
    axios
      .post('https://queenchess-backend.herokuapp.com/account/login', {
        email: this.email,
        password:this.password
      })
      .then(res => {
        console.log("statusCode: ${res.status}")
      })
      .catch(error => {
        console.error(error);
      })
    if (1) {  //Replace with result of calling backend's login validator
      localStorage.setItem('email', this.email);
      //localStorage.setItem('userId', ...) Store retrieved user's ID
      this.router.navigateByUrl('/');
    }
  }
}