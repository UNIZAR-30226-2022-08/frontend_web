import { Component } from "@angular/core";
import { Router } from "@angular/router";
import axios from 'axios';

@Component({
  selector: "app-mainMenu",
  templateUrl: "./mainMenu.component.html",
  styleUrls: ["./mainMenu.component.css"]
})
export class MainMenuComponent {
  constructor(public router: Router) {
    axios
      .get('https://queenchess-backend.herokuapp.com/account/checkSession', {
      })
      .then((res) => {
        if (res.status === 200) {
          localStorage.setItem("user", res.data.response.username);
          localStorage.setItem("email", res.data.response.email);
          console.log("Response session data: " + res.data);
          console.log("Storing username: " + localStorage.getItem("user"));
        } else if (res.status === 400) {
          localStorage.clear();
          console.log("check session error: " + res.status);
          this.router.navigateByUrl('/home');
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }

  logOut() {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    this.router.navigateByUrl('/home');
    axios
      .post('https://queenchess-backend.herokuapp.com/account/logout', {
      })
      .then((res) => {
        if (res.status === 201) {
          
        } else {
          console.log("logout error: " + res.status);
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }
}