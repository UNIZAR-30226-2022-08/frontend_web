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