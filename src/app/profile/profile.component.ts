import { Component } from "@angular/core";
import { Router } from "@angular/router";
import axios from 'axios';

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent { 

  password: string;
  newPassword: string;
  confirmNewPassword: string;

  constructor(public router: Router) {
    
  }
  
  //This gets called after constructor (angular doesn't let you access elements in the constructor)
  ngOnInit() {
    var userElement = document.getElementById("usernameText");
    if (userElement != undefined) {
      let username = localStorage.getItem("username");
      if (username != null) {
        userElement.textContent += username;
      }
    }
  }

  changePassword() {
    if (this.newPassword !== this.confirmNewPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    axios
      .post('https://queenchess-backend.herokuapp.com/account/changePassword', {
        email: localStorage.getItem("email"),
        password:this.newPassword
      })
      .then((res) => {
        if (res.status === 201) {
          alert("Contraseña cambiada con éxito");
        } else {
          alert("Error cambiando la contraseña");
          console.log("changepass error: " + res.status);
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }
}