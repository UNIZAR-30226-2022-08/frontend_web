import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./tablero.component.html",
  styleUrls: ["./tablero.component.css"]
})
export class TableroComponent {

  constructor(public router: Router) {}

  board: string[][];

  clearBoard(){
    for(let i = 0; i <= 8; i++){
      for(let j = 0; j<= 8; j++){
        this.board[i][j] = "";
      }
    }
  }

  startGame(){
    for(let i = 0; i <= 8; i++){
      for(let j = 0; j<= 8; j++){
        if(i < 2 || i > 6) this.board[i][j] = "";
        else this.board[i][j] = "";
      }
    }
  }
  prueba(){
    console.log("HOLA");
  }
}
