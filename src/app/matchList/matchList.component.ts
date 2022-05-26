import { Component } from "@angular/core";
import { Router } from "@angular/router";
import axios from 'axios';

@Component({
  selector: "app-matchList",
  templateUrl: "./matchList.component.html",
  styleUrls: ["./matchList.component.css"]
})
export class MatchListComponent {
  constructor(public router: Router) { }

  match: string;
  matchList: string[] = [];
  matchListSync: string[] = [];
  idPlayedList: number[] = [];
  idList: number[] = [];
  idListSync: number[] = [];
  playedMatchList: string[] = [];

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
      .get('https://queenchess-backend.herokuapp.com/game/getActiveGames', {
      })
      .then((res) => {
        if (res.status === 200) {
          for (let i = 0; i < res.data.response.length; i++) {
            console.log(res.data.response[i]);
            if (res.data.response[i].isAsync) {
              if (res.data.response[i].whitePlayer === localStorage.getItem("user")) {
                console.log("player is white")
                if (res.data.response[i].turn) {
                  this.matchList.push(res.data.response[i].blackPlayer);
                  this.idList.push(parseInt(res.data.response[i].id));
                } else if (!(res.data.response[i].turn)) {
                  this.playedMatchList.push(res.data.response[i].blackPlayer);
                  this.idPlayedList.push(parseInt(res.data.response[i].id));
                }
              } else if (res.data.response[i].blackPlayer === localStorage.getItem("user")) {
                console.log("player is black")
                if (res.data.response[i].turn) {
                  this.playedMatchList.push(res.data.response[i].whitePlayer);
                  this.idPlayedList.push(parseInt(res.data.response[i].id));
                } else if (!(res.data.response[i].turn)) {
                  this.matchList.push(res.data.response[i].whitePlayer);
                  this.idList.push(parseInt(res.data.response[i].id));
                }
              }
              } else {
                if (res.data.response[i].whitePlayer === localStorage.getItem("user")) {
                  console.log("player is white")

                  this.matchListSync.push(res.data.response[i].blackPlayer);
                  this.idListSync.push(parseInt(res.data.response[i].id));

                } else if (res.data.response[i].blackPlayer === localStorage.getItem("user")) {
                  console.log("player is black")
                  this.matchListSync.push(res.data.response[i].whitePlayer);
                  this.idListSync.push(parseInt(res.data.response[i].id));

                }
              }
            
            console.log("\n"); 
          }
        } else {
          console.log("get matches error: " + res.status);
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }

  playMove(match: number) {
    this.router.navigate(['/tableroAsincrono/'],
    {
      queryParams: { matchId: match.toString() }
    });
  }

  playMoveSync(match: number) {
    this.router.navigate(['/tableroSincrono/'],
    {
      queryParams: { matchId: match.toString() }
    });
  }

}