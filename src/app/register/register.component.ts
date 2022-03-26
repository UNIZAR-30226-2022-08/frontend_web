import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent {
  email: string;
  password: string;
  confirmPassword: string;

  constructor(public router: Router) {}

  register() {
    console.log(this.email);
    console.log(this.password);
    console.log(this.confirmPassword);
    this.router.navigate(['/login']);  }
}