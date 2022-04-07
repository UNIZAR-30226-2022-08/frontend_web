import { Component } from "@angular/core";
import { Router } from "@angular/router";
import axios from 'axios';

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;

  constructor(public router: Router) {}

  validateEmail(emailToValidate: string) {
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(emailToValidate).toLowerCase());
  }

  validatePassword(passwordToValidate: string): string {
      if (passwordToValidate.length < 4) {
          return("La contraseña ha de tener al menos 4 caracteres");
      } else if (passwordToValidate.length > 50) {
          return("La contraseña no ha de exceder los 50 caracteres");
      } else if (passwordToValidate.search(/\d/) == -1) {
          return("La contraseña ha de contener al menos un número y una mayúscula");
      } else if (passwordToValidate.search(/[A-Z]/) == -1) {
          return ("La contraseña ha de contener al menos un número y una mayúscula");
      } else return ("ok");
  }

  register() {
    console.log(this.email);
    console.log(this.password);
    console.log(this.confirmPassword);
    
    if (this.email == null) {
      alert("Email requerido");
      return;
    }
    if (this.password == null) {
      alert("Contraseña requerida");
      return;
    }
    if (this.password == null) {
      alert("Confirme su contraseña");
      return;
    }
    if (this.username == null) {
      alert("Introduzca un nombre de usuario válido");
      return;
    }
    if (!this.validateEmail(this.email)){
      alert("Email no válido");
      return;
    }
    var passVal = this.validatePassword(this.password);
    if (passVal != "ok") {
      alert(passVal);
      return;
    }
    if (this.password != this.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    
    let responseCode = 400;
    axios
      .post('https://queenchess-backend.herokuapp.com/account/register', {
        email: this.email,
        password:this.password,
        username:this.username
      })
      .then((res) => {
        responseCode = res.status;
      })
      .catch((error) => {
        console.error(error);
      })
    if (responseCode == 200) { 
      this.router.navigate(['/register']);
    } else {
      console.log("error");
    }
  }
}