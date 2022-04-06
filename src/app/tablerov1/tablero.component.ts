import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./tablero.component.html",
  styleUrls: ["./tablero.component.css"]
})

export class TableroComponent {

  constructor(public router: Router) {
    this.startGame();
  }
  initialRow: string[] = ["rook", "knight", "bishop", "king", "queen", "bishop", "knight", "rook"];
  board: string[][];
  selected: string = "";

  clearBoard(){
    for(let i = 0; i <= 8; i++){
      for(let j = 0; j<= 8; j++){
        this.board[i][j] = "";
      }
    }
  }

  startGame(){
    this.board = [];
    for(let i = 0; i < 8; i++){
      this.board[i] = [];
      for(let j = 0; j< 8; j++){
        if(i == 0){
          this.board[i][j] = this.initialRow[j] + "A";
        }
        else if(i == 7){
          this.board[i][j] = this.initialRow[j] + "B";
        }
        else if (i == 1){
          this.board[i][j] = "pawn" + "A";
        }
        else if (i == 6){
          this.board[i][j] = "pawn" + "B";
        }
        else this.board[i][j] = " ";
      }
    }
    this.logBoard();
  }

  logBoard(){
    let boardString = "";
    for(let i = 0; i < 8; i++){
      for(let j = 0; j< 8; j++){
        boardString += this.board[i][j];
      }
      boardString+="\n";
    }
    console.log(boardString);
  }

  codeToCoord(code: string): [number, number]{
    let charX = code.charAt(0);
    let charY = code.charAt(1);
  
    let x = charX.charCodeAt(0) - 97;
    let y = Number(charY) - 1;

    console.log(x);
    console.log(y);
    return [x,y];
  }

  checkClick(destiny: string){
    if (this.selected === "") {
      this.selected = destiny;
    } else {

      // If destiny is in possible moves
      this.movePiece(destiny);

      this.selected = "";
    }
  }

  movePiece(destiny: string){
    console.log(this.selected);
    let [i, j] = this.codeToCoord(this.selected);
    let [x, y] = this.codeToCoord(destiny);
    let piece = this.board[i][j];
    this.board[i][j] = "";
    this.board[x][y] = piece;
    console.log(this.board[i][j]);
    console.log(this.board[x][y]);
  }

  prueba(){
    console.log("HOLA");
  }


}
