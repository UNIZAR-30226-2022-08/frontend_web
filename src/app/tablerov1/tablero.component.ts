import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ColdObservable } from "rxjs/internal/testing/ColdObservable";

@Component({
  selector: "app-home",
  templateUrl: "./tablero.component.html",
  styleUrls: ["./tablero.component.css"]
})

export class TableroComponent {

  constructor(public router: Router) {
    this.startGame();
  }
  initialRow: string[] = ["rook_1", "knight_1", "bishop_1", "queen_1", "king_1", "bishop_2", "knight_2", "rook_2"];
  board: string[][];
  selected: string = "";
  turnWhite: boolean = true;

  clearBoard(){
    for(let i = 0; i <= 8; i++){
      for(let j = 0; j<= 8; j++){
        this.board[i][j] = "";
      }
    }
  }

  // Back-end should initialize board ## Remove this?
  startGame(){
    this.board = [];
    for(let i = 0; i < 8; i++){
      this.board[i] = [];
      for(let j = 0; j< 8; j++){
        if(i == 0){
          this.board[i][j] = "white_"+this.initialRow[j];
        }
        else if(i == 7){
          this.board[i][j] = "black_"+this.initialRow[j];
        }
        else if (i == 1){
          this.board[i][j] = "white_pawn_" + String.fromCharCode(j+1 + '0'.charCodeAt(0));
        }
        else if (i == 6){
          this.board[i][j] = "black_pawn_" + String.fromCharCode(j+1 + '0'.charCodeAt(0));
        }
        else this.board[i][j] = "";
      }
    }
    this.logBoard();
  }

  logBoard(){
    let boardString = "";
    for(let i = 7; i >= 0; i--){
      for(let j = 0; j< 8; j++){
        boardString += this.board[i][j];
        boardString += "\t";
      }
      boardString+="\n";
    }
    console.log(boardString);
  }

  codeToCoord(code: string): [number, number]{
    let charX = code.charAt(1);
    let charY = code.charAt(0);
  
    let x = Number(charX) - 1;
    let y = charY.charCodeAt(0) - 97;

    console.log(x);
    console.log(y);
    return [x,y];
  }

  parsePiece(pieceCode: string): [boolean, string]{
    var splitted = pieceCode.split("_",2);
    var isWhite;
    var pieceType = splitted[1];
    if (splitted[0] === "black") {
      isWhite = false;
    } else isWhite = true;
    console.log("parse:" + isWhite + pieceType);
    return [isWhite, pieceType];
  }

  checkClick(clicked: string) {
    if (this.selected === "") {
      let [x, y] = this.codeToCoord(clicked);
      let [color, pieceType] = this.parsePiece(this.board[x][y]);
      if (color === this.turnWhite && this.board[x][y] !=="") {
        this.selected = clicked;
        console.log(this.selected);
      }
    }
    else {
      // If destiny is in possible moves (call to backend possible moves)
      let [i, j] = this.codeToCoord(this.selected);
      let [x, y] = this.codeToCoord(clicked);
      if (this.board[i][j] !== "" && (this.board[i][j] !== this.board[x][y])) {
        this.movePiece(clicked);
      }
      this.selected = "";

    }
  }

  movePiece(destiny: string){
    let [i, j] = this.codeToCoord(this.selected);
    let [x, y] = this.codeToCoord(destiny);

    console.log("Origin"+this.board[i][j]);
    console.log("Destiny"+this.board[x][y]);

    var domOriginPiece = document.getElementById(this.board[i][j]);
    console.log(domOriginPiece);
    var domDestiny = document.getElementById(destiny);

    if (this.board[x][y] != "") {
      var domDestinyPiece = <Node>document.getElementById(this.board[x][y]);
      domDestinyPiece?.parentNode?.removeChild(domDestinyPiece);
    }
    domDestiny?.appendChild(<Node>domOriginPiece);

    let piece = this.board[i][j];
    this.board[i][j] = "";
    this.board[x][y] = piece;
    this.turnWhite = !this.turnWhite;
  }

  prueba(){
    console.log("HOLA");
  }


}
