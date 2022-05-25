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
    
    var userElement = document.getElementById("usernameText");
    if (userElement != undefined) {
      let username = localStorage.getItem("user");
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
        newPassword:this.newPassword
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