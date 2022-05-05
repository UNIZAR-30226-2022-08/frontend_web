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
    if (localStorage.getItem("email") === null) {
      this.router.navigateByUrl('/home');
    }
  }

  logOut() {
    axios
      .post('https://queenchess-backend.herokuapp.com/account/logout', {
      })
      .then((res) => {
        if (res.status === 201) {
          localStorage.removeItem("username");
          localStorage.removeItem("email");
          this.router.navigateByUrl('/home');
        } else {
          console.log("login error: " + res.status);
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }
}