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
  playedMatchList: string[] = [];
  //This gets called after constructor (angular doesn't let you access elements in the constructor)
  ngOnInit() {
    this.matchList.push("match1");
    axios
      .get('https://queenchess-backend.herokuapp.com/game/getActiveGames', {
      })
      .then((res) => {
        if (res.status === 200) {
          for (let i = 0; i < res.data.response.length; i++) {
            if (res.data.response[i].whitePlayer === localStorage.getItem("username")) {
              if (res.data.response[i].turn) {
                this.matchList.push(res.data.response[i].blackPlayer);
              } else {
                this.playedMatchList.push(res.data.response[i].blackPlayer);
              }
            } else if (res.data.response[i].blackPlayer === localStorage.getItem("username")){
              if (res.data.response[i].turn) {
                this.playedMatchList.push(res.data.response[i].whitePlayer);
              } else {
                this.matchList.push(res.data.response[i].whitePlayer);
              }
            } 
          }
        } else {
          console.log("get matches error: " + res.status);
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }

  playMove(match: string) {
    this.router.navigate(['/tableroAsincrono/'],
    {
      queryParams: { matchId: match }
    });
  }

}