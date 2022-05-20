import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent {
  email: string;
  password: string;

  constructor(public router: Router) {
    if (localStorage.getItem("email") !== null) {
      this.router.navigateByUrl('/mainMenu');
    }
  }

}