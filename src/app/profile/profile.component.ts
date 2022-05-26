import { Component } from "@angular/core";
import { Router } from "@angular/router";
import axios from 'axios';

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent {

  password: string = "";
  newPassword: string = "";
  confirmNewPassword: string = "";
  playedGames: number = 0;
  wonGames: number = 0;
  winrate: number = 0;
  playedTournaments: number = 0;
  wonTournaments: number = 0;
  elo: number = 0;
  money: number = 0;
  userName: string = "";

  matchList: string[] = [];
  idList: string[] = [];

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

    axios
      .get('https://queenchess-backend.herokuapp.com/community/getPublicProfile?username=' + localStorage.getItem("user"), {
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          this.playedGames = res.data.response.stats.playedGames;
          this.wonGames = res.data.response.stats.wonGames;
          this.wonTournaments = res.data.response.stats.wonTournaments;
          this.playedTournaments = res.data.response.stats.playedTournaments;
          this.elo = res.data.response.user.elo;
          this.money = res.data.response.user.money;
          this.userName = res.data.response.user.username;


          var userElement = document.getElementById("usernameText");
          var wonGamesElement = document.getElementById("wonGamesText");
          var playedGamesElement = document.getElementById("playedGamesText");
          var wonTournamentsElement = document.getElementById("wonTournamentsText");
          var playedTournamentsElement = document.getElementById("playedTournamentsText");
          var eloElement = document.getElementById("eloText");
          var moneyElement = document.getElementById("moneyText");


          if (userElement != undefined) {
            if (this.userName != null) {
              userElement.textContent += this.userName;
            }
          }

          if (wonGamesElement != undefined) {
            if (this.wonGames != null) {
              wonGamesElement.textContent += this.wonGames.toString();
            }
          }


          if (playedGamesElement != undefined) {
            if (this.playedGames != null) {
              playedGamesElement.textContent += this.playedGames.toString();
            }
          }

          if (wonTournamentsElement != undefined) {
            if (this.wonTournaments != null) {
              wonTournamentsElement.textContent += this.wonTournaments.toString();
            }
          }

          if (playedTournamentsElement != undefined) {
            if (this.playedTournaments != null) {
              playedTournamentsElement.textContent += this.playedTournaments.toString();
            }
          }

          if (eloElement != undefined) {
            if (this.elo != null) {
              eloElement.textContent += this.elo.toString() + " 🏆";
            }
          }

          if (moneyElement != undefined) {
            if (this.money != null) {
              moneyElement.textContent += this.money.toString() + " 🪙";
            }
          }

          for (let i = 0; i < res.data.response.recentGames.length; i++) {
            if (res.data.response[i].whitePlayer === localStorage.getItem("user")) {
              console.log("player is white")
                this.matchList.push(res.data.response[i].blackPlayer);
                this.idList.push(res.data.response.recentGames[i].id);
              
            } else if (res.data.response[i].blackPlayer === localStorage.getItem("user")) {
              console.log("player is black")
                this.matchList.push(res.data.response[i].whitePlayer);
                this.idList.push(res.data.response.recentGames[i].id);
            }
          }
        } else if (res.status === 400) {
          console.log("check session error: " + res.status);
        }
      })
      .catch((error) => {
        console.error(error);
      })
 
  }

  changePassword() {
    if (this.newPassword !== this.confirmNewPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    axios
      .post('https://queenchess-backend.herokuapp.com/account/changePassword', {
        newPassword: this.newPassword
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