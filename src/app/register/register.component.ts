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

  register() {
    var check = document.getElementById("email");
    if (check != undefined) {
      check.style.display = "none";
    }
    check = document.getElementById("emailValido");
    if (check != undefined) {
      check.style.display = "none";
    }
    check = document.getElementById("contrasena");
    if (check != undefined) {
      check.style.display = "none";
    }
    check = document.getElementById("usuario");
    if (check != undefined) {
      check.style.display = "none";
    }
    check = document.getElementById("contrasenaCorta");
    if (check != undefined) {
      check.style.display = "none";
    }
    check = document.getElementById("contrasenaLarga");
    if (check != undefined) {
      check.style.display = "none";
    }
    check = document.getElementById("contrasenaMal");
    if (check != undefined) {
      check.style.display = "none";
    }
    check = document.getElementById("contrasenaCoincide");
    if (check != undefined) {
      check.style.display = "none";
    }

    console.log(this.email);
    console.log(this.password);
    console.log(this.confirmPassword);
    
    if (this.email == null) {
      var emailIncorrecta = document.getElementById("email");
      if (emailIncorrecta != undefined) {
        emailIncorrecta.style.display = "block";
      }
    }
    else if (!this.validateEmail(this.email)){
      var emailIncorrecta = document.getElementById("emailValido");
      if (emailIncorrecta != undefined) {
        emailIncorrecta.style.display = "block";
      }
    }
    if (this.password == null) {
      var contrasenaIncorrecta = document.getElementById("contrasena");
      if (contrasenaIncorrecta != undefined) {
        contrasenaIncorrecta.style.display = "block";
      }
    }
    if (this.username == null) {
      var usuarioIncorrecto = document.getElementById("usuario");
      if (usuarioIncorrecto != undefined) {
        usuarioIncorrecto.style.display = "block";
      }
    }
    if (this.password.length < 4) {
      var contrasenaIncorrecta = document.getElementById("contrasenaCorta");
      if (contrasenaIncorrecta != undefined) {
        contrasenaIncorrecta.style.display = "block";
      }
    } else if (this.password.length > 50) {
      var contrasenaIncorrecta = document.getElementById("contrasenaLarga");
      if (contrasenaIncorrecta != undefined) {
        contrasenaIncorrecta.style.display = "block";
      }
    } else if (this.password.search(/\d/) == -1) {
      var contrasenaIncorrecta = document.getElementById("contrasenaMal");
      if (contrasenaIncorrecta != undefined) {
        contrasenaIncorrecta.style.display = "block";
      }
    } else if (this.password.search(/[A-Z]/) == -1) {
        var contrasenaIncorrecta = document.getElementById("contrasenaMal");
        if (contrasenaIncorrecta != undefined) {
          contrasenaIncorrecta.style.display = "block";
        }
    }
    if (this.password != this.confirmPassword) {
      var contrasenaIncorrecta = document.getElementById("contrasenaCoincide");
      if (contrasenaIncorrecta != undefined) {
        contrasenaIncorrecta.style.display = "block";
      }
    }
    
    axios
      .post('https://queenchess-backend.herokuapp.com/account/register', {
        email: this.email,
        password:this.password,
        username:this.username
      })
      .then((res) => {
        if (res.status === 201) { 
          this.router.navigate(['/login']);
        } else {
          console.log("register error: " + res.status);
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }
}