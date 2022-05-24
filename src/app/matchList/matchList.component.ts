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
  idList: string[] = [];
  playedMatchList: string[] = [];
  //This gets called after constructor (angular doesn't let you access elements in the constructor)
  ngOnInit() {
    axios
      .get('https://queenchess-backend.herokuapp.com/game/getActiveGames', {
      })
      .then((res) => {
        if (res.status === 200) {
          for (let i = 0; i < res.data.response.length; i++) {
            if (res.data.response[i].whitePlayer === localStorage.getItem("user")) {
              console.log("player is white")
              if (res.data.response[i].turn) {
                this.matchList.push(res.data.response[i].blackPlayer);
                this.idList.push(res.data.response[i].id);
              } else {
                this.playedMatchList.push(res.data.response[i].blackPlayer);
                this.idList.push(res.data.response[i].id);
              }
            } else if (res.data.response[i].blackPlayer === localStorage.getItem("user")){
              console.log("player is black")
              if (res.data.response[i].turn) {
                this.playedMatchList.push(res.data.response[i].whitePlayer);
                this.idList.push(res.data.response[i].id);
              } else {
                this.matchList.push(res.data.response[i].whitePlayer);
                this.idList.push(res.data.response[i].id);
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