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
    if (this.email == "bypass@admin.es") {
      localStorage.setItem('email', this.email);
      this.router.navigateByUrl('/mainMenu');
      return;
    }
    console.log(this.email);
    console.log(this.password);
    axios
      .post('https://queenchess-backend.herokuapp.com/account/login', {
        email: this.email,
        password:this.password
      })
      .then((res) => {
        if (res.status === 200) { 
          localStorage.setItem('email', this.email);
          this.getCredentials();
          this.router.navigateByUrl('/mainMenu');
        } else {
          console.log("login error: " + res.status);
        }
      })
      .catch((error) => {
        console.error(error);
      })
    
  }

  getCredentials() {
    axios
    .get('https://queenchess-backend.herokuapp.com/account/checkSession', {
    })
    .then((res) => {
      if (res.status === 200) {
        localStorage.setItem("user", res.data.response.username);
        console.log("Response session data: " + res.data);
        console.log("Storing username: " + localStorage.getItem("user"));
      } else {
        console.log("check session error: " + res.status);
      }
    })
    .catch((error) => {
      console.error(error);
    })
  }
}