import { Component } from "@angular/core";
import { HAMMER_LOADER } from "@angular/platform-browser";
import { Params, Router } from "@angular/router";
import { ColdObservable } from "rxjs/internal/testing/ColdObservable";
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';

@Component({
  selector: "app-mainMenu",
  templateUrl: "./tableroAsincrono.component.html",
  styleUrls: ["./tableroAsincrono.component.css"]
})


export class TableroAsincronoComponent {

  constructor(public route: ActivatedRoute, public router: Router) {
  }

  initialRow: string[] = ["rook_1", "knight_1", "bishop_1", "queen_1", "king_1", "bishop_2", "knight_2", "rook_2"];
  board: string[][];
  secondBoard: string[][];
  auxBoard: string[][];
  auxBoard2: string[][];
  selected: string = "";
  turnWhite: boolean = true;
  possibleMoves: string[] = [];
  possibleMovesToCheckWhiteKing: string[] = [];
  jaqueNegro = false;
  jaqueBlanco = false;
  whiteRook1 = true;
  whiteRook2 = true;
  blackRook1 = true;
  blackRook2 = true;
  whiteKing = true;
  blackKing = true;
  castling = false;
  queenCounter = 2;
  knightCounter = 3;
  rookCounter = 3;
  bishopCounter = 3;
  pawnCounter = 1;
  squareToSummon = "";
  choosingSummon = false;

  opponent = "";
  matchId = "";
  playerIsWhite = true;

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.matchId = params["matchId"];
        console.log("Id de partida: " + this.matchId);
        this.startGame();
      }
      );
  }
  // Removes all pieces from board
  clearBoard() {
    for (let i = 0; i <= 8; i++) {
      for (let j = 0; j <= 8; j++) {
        this.board[i][j] = "";
      }
    }
  }
  
  getPieceIndex(type: string) {
    switch (type) {
      case "pawn":
        this.pawnCounter++;
        return ("_" + (this.pawnCounter - 1));
      case "rook":
        this.rookCounter++;
        return ("_" + (this.pawnCounter - 1));
      case "bishop":
        this.bishopCounter++;
        return ("_" + (this.bishopCounter - 1));
      case "knight":
        this.knightCounter++;
        return ("_" + (this.knightCounter - 1));
      case "queen":
        this.queenCounter++;
        return ("_" + (this.queenCounter - 1));
      case "king":
        return ("");
      default:
        return ("");
    }
  }

  initHTMLBoard() {
    
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (this.board[i][j] != "") {
          let [x, y] = this.codeToCoord(this.board[i][j]);
          var squareToPlacePiece = document.getElementById(this.board[x][y]);
          let pieceToPlace = document.createElement('span');
          let pieceImage = document.createElement('img');
          let pieceColor, pieceType = this.parsePiece(this.board[i][j]);
          pieceImage.setAttribute('src', "../../assets/defaultPieces/" + pieceColor + "_" + pieceType + ".png");
          pieceImage.setAttribute('width', "40");
          pieceImage.setAttribute('height', "52");
          pieceToPlace.setAttribute('id', this.board[i][j]);
          pieceToPlace.setAttribute('class', "piece");
          pieceToPlace.appendChild(pieceImage);
          squareToPlacePiece?.appendChild(<Node>pieceToPlace);
        }
      }
    }

  }

  // Back-end should initialize board?
  startGame() {
    this.startSecondBoard();
    this.startAuxBoard();
    this.startAuxBoard2();
    this.board = [];
    for (let i = 0; i < 8; i++) {
      this.board[i] = [];
      for (let j = 0; j < 8; j++) {
        this.board[i][j] = "";
      }
    }
    axios
      .get('https://queenchess-backend.herokuapp.com/game/getGame?gameId=' + this.matchId, {
      })
      .then((res) => {
        if (res.status === 200) {
          if (res.data.response.whitePlayer.references.key === localStorage.getItem("user")) {
            this.playerIsWhite = true;
          } else this.playerIsWhite = false;

            // Place white pieces
            for (let i = 0; i < res.data.response.boardState.whitePieces.length; i++) {
              let pieceToPlace = res.data.response.boardState.whitePieces[i];
              let pieceIndex = this.getPieceIndex(pieceToPlace.type);
              this.board[pieceToPlace.pos.x][pieceToPlace.pos.y] = "white_" + pieceToPlace.type + pieceIndex;
            }

            // Place black pieces
            for (let i = 0; i < res.data.response.boardState.blackPieces.length; i++) {
              let pieceToPlace = res.data.response.boardState.blackPieces[i];
              let pieceIndex = this.getPieceIndex(pieceToPlace.type);
              this.board[pieceToPlace.pos.x][pieceToPlace.pos.y] = "white_" + pieceToPlace.type + pieceIndex;
            }

        } else {
          console.log("get matches error: " + res.status);
        }
      })
      .catch((error) => {
        console.error(error);
      })  
  }

  startSecondBoard() {
    this.secondBoard = [];
    for (let i = 0; i < 8; i++) {
      this.secondBoard[i] = [];
      for (let j = 0; j < 8; j++) {
        this.secondBoard[i][j] = "";
      }
    }
  }

  startAuxBoard() {
    this.auxBoard = [];
    for (let i = 0; i < 8; i++) {
      this.auxBoard[i] = [];
      for (let j = 0; j < 8; j++) {
        this.auxBoard[i][j] = "";
      }
    }
  }

  startAuxBoard2() {
    this.auxBoard2 = [];
    for (let i = 0; i < 8; i++) {
      this.auxBoard2[i] = [];
      for (let j = 0; j < 8; j++) {
        this.auxBoard2[i][j] = "";
      }
    }
  }

  copyBoard(to: string[][], from: string[][]) {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        to[i][j] = from[i][j];
      }
    }
  }



  copySecondBoard() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board.length; j++) {
        this.secondBoard[i][j] = this.board[i][j];
      }
    }
  }


  // Calculates and stores all possible moves in the possibleMoves array
  // Calculates and stores all possible moves in the possibleMoves array
  setPossibleMoves(squareCode: string, examine: boolean) {
    this.possibleMoves = [];
    let [x, y] = this.codeToCoord(squareCode);
    let [isWhite, pieceType] = this.parsePiece(this.board[x][y]);
    switch (pieceType) {
      case "pawn":
        if (isWhite) {
          // The square in front of the pawn is empty
          if (this.board[x][y + 1] == "") {
            this.copySecondBoard();
            this.secondBoard[x][y + 1] = this.board[x][y];
            this.secondBoard[x][y] = "";
            if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, y + 1));

          }
          // The pawn is in the starting square and the two in front are empty
          if (this.board[x][y + 2] == "" && this.board[x][y + 1] == "" && y == 1) {
            this.copySecondBoard();
            this.secondBoard[x][y + 2] = this.board[x][y];
            this.secondBoard[x][y] = "";
            if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, y + 2));
          }
          // Eat right diagonal
          if (x < 7 && y < 7 && this.parseColour(this.board[x + 1][y + 1]) == 'b') {
            this.copySecondBoard();
            this.secondBoard[x + 1][y + 1] = this.board[x][y];
            this.secondBoard[x][y] = "";
            if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x + 1, y + 1));
          }
          // Eat left diagonal
          if (x > 0 && y < 7 && this.parseColour(this.board[x - 1][y + 1]) == 'b') {
            this.copySecondBoard();
            this.secondBoard[x - 1][y + 1] = this.board[x][y];
            this.secondBoard[x][y] = "";
            if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x - 1, y + 1));
          }

        }
        else if (!(isWhite)) {
          // The square in front of the pawn is empty
          if (this.board[x][y - 1] == "") {
            this.copySecondBoard();
            this.secondBoard[x][y - 1] = this.board[x][y];
            this.secondBoard[x][y] = "";
            if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, y - 1));
          }
          // The pawn is in the starting square and the two in front are empty
          if (this.board[x][y - 2] == "" && this.board[x][y - 1] == "" && y == 6) {
            this.copySecondBoard();
            this.secondBoard[x][y - 2] = this.board[x][y];
            this.secondBoard[x][y] = "";
            if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, y - 2));
          }
          // Eat right diagonal
          if (x < 7 && y > 0 && this.parseColour(this.board[x + 1][y - 1]) == 'w') {
            this.copySecondBoard();
            this.secondBoard[x + 1][y - 1] = this.board[x][y];
            this.secondBoard[x][y] = "";
            if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x + 1, y - 1));
          }
          // Eat left diagonal
          if (x > 0 && y > 0 && this.parseColour(this.board[x - 1][y - 1]) == 'w') {
            this.copySecondBoard();
            this.secondBoard[x - 1][y - 1] = this.board[x][y];
            this.secondBoard[x][y] = "";
            if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x - 1, y - 1));
          }
        }
        break;
      case "knight":
        if (isWhite) {

          let aux_x = x;
          let aux_y = y;

          // Move up left
          aux_x = Number(x) - 1;
          aux_y = Number(y) + 2;
          if (aux_x >= 0 && aux_y <= 7 && (this.board[aux_x][aux_y] == "" || this.parseColour(this.board[aux_x][aux_y]) == 'b')) {
            this.copySecondBoard();
            this.secondBoard[aux_x][aux_y] = this.board[x][y];
            this.secondBoard[x][y] = "";
            if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
          }


          aux_x = Number(x) - 2;
          aux_y = Number(y) + 1;
          if (aux_x >= 0 && aux_y <= 7 && (this.board[aux_x][aux_y] == "" || this.parseColour(this.board[aux_x][aux_y]) == 'b')) {
            this.copySecondBoard();
            this.secondBoard[aux_x][aux_y] = this.board[x][y];
            this.secondBoard[x][y] = "";
            if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
          }

          // Move up right
          aux_x = Number(x) + 1;
          aux_y = Number(y) + 2;
          if (aux_x <= 7 && aux_y <= 7 && (this.board[aux_x][aux_y] == "" || this.parseColour(this.board[aux_x][aux_y]) == 'b')) {
            this.copySecondBoard();
            this.secondBoard[aux_x][aux_y] = this.board[x][y];
            this.secondBoard[x][y] = "";
            if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
          }

          aux_x = Number(x) + 2;
          aux_y = Number(y) + 1;
          if (aux_x <= 7 && aux_y <= 7 && (this.board[aux_x][aux_y] == "" || this.parseColour(this.board[aux_x][aux_y]) == 'b')) {
            this.copySecondBoard();
            this.secondBoard[aux_x][aux_y] = this.board[x][y];
            this.secondBoard[x][y] = "";
            if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
          }

          // Move down left
          aux_x = Number(x) - 1;
          aux_y = Number(y) - 2;
          if (aux_x >= 0 && aux_y >= 0 && (this.board[aux_x][aux_y] == "" || this.parseColour(this.board[aux_x][aux_y]) == 'b')) {
            this.copySecondBoard();
            this.secondBoard[aux_x][aux_y] = this.board[x][y];
            this.secondBoard[x][y] = "";
            if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
          }

          aux_x = Number(x) - 2;
          aux_y = Number(y) - 1;
          if (aux_x >= 0 && aux_y >= 0 && (this.board[aux_x][aux_y] == "" || this.parseColour(this.board[aux_x][aux_y]) == 'b')) {
            this.copySecondBoard();
            this.secondBoard[aux_x][aux_y] = this.board[x][y];
            this.secondBoard[x][y] = "";
            if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
          }

          // Move down right
          aux_x = Number(x) + 1;
          aux_y = Number(y) - 2;
          if (aux_x <= 7 && aux_y >= 0 && (this.board[aux_x][aux_y] == "" || this.parseColour(this.board[aux_x][aux_y]) == 'b')) {
            this.copySecondBoard();
            this.secondBoard[aux_x][aux_y] = this.board[x][y];
            this.secondBoard[x][y] = "";
            if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
          }

          aux_x = Number(x) + 2;
          aux_y = Number(y) - 1;
          if (aux_x <= 7 && aux_y >= 0 && (this.board[aux_x][aux_y] == "" || this.parseColour(this.board[aux_x][aux_y]) == 'b')) {
            this.copySecondBoard();
            this.secondBoard[aux_x][aux_y] = this.board[x][y];
            this.secondBoard[x][y] = "";
            if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
          }
        }

        else if (!(isWhite)) {
          let aux_x = x;
          let aux_y = y;

          // Move up left
          aux_x = Number(x) - 1;
          aux_y = Number(y) + 2;
          if (aux_x >= 0 && aux_y <= 7 && (this.board[aux_x][aux_y] == "" || this.parseColour(this.board[aux_x][aux_y]) == 'w')) {
            this.copySecondBoard();
            this.secondBoard[aux_x][aux_y] = this.board[x][y];
            this.secondBoard[x][y] = "";
            if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
          }

          aux_x = Number(x) - 2;
          aux_y = Number(y) + 1;
          if (aux_x >= 0 && aux_y <= 7 && (this.board[aux_x][aux_y] == "" || this.parseColour(this.board[aux_x][aux_y]) == 'w')) {
            this.copySecondBoard();
            this.secondBoard[aux_x][aux_y] = this.board[x][y];
            this.secondBoard[x][y] = "";
            if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
          }

          // Move up right
          aux_x = Number(x) + 1;
          aux_y = Number(y) + 2;
          if (aux_x <= 7 && aux_y <= 7 && (this.board[aux_x][aux_y] == "" || this.parseColour(this.board[aux_x][aux_y]) == 'w')) {
            this.copySecondBoard();
            this.secondBoard[aux_x][aux_y] = this.board[x][y];
            this.secondBoard[x][y] = "";
            if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
          }

          aux_x = Number(x) + 2;
          aux_y = Number(y) + 1;
          if (aux_x <= 7 && aux_y <= 7 && (this.board[aux_x][aux_y] == "" || this.parseColour(this.board[aux_x][aux_y]) == 'w')) {
            this.copySecondBoard();
            this.secondBoard[aux_x][aux_y] = this.board[x][y];
            this.secondBoard[x][y] = "";
            if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
          }

          // Move down left
          aux_x = Number(x) - 1;
          aux_y = Number(y) - 2;
          if (aux_x >= 0 && aux_y >= 0 && (this.board[aux_x][aux_y] == "" || this.parseColour(this.board[aux_x][aux_y]) == 'w')) {
            this.copySecondBoard();
            this.secondBoard[aux_x][aux_y] = this.board[x][y];
            this.secondBoard[x][y] = "";
            if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
          }

          aux_x = Number(x) - 2;
          aux_y = Number(y) - 1;
          if (aux_x >= 0 && aux_y >= 0 && (this.board[aux_x][aux_y] == "" || this.parseColour(this.board[aux_x][aux_y]) == 'w')) {
            this.copySecondBoard();
            this.secondBoard[aux_x][aux_y] = this.board[x][y];
            this.secondBoard[x][y] = "";
            if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
          }

          // Move down right
          aux_x = Number(x) + 1;
          aux_y = Number(y) - 2;
          if (aux_x <= 7 && aux_y >= 0 && (this.board[aux_x][aux_y] == "" || this.parseColour(this.board[aux_x][aux_y]) == 'w')) {
            this.copySecondBoard();
            this.secondBoard[aux_x][aux_y] = this.board[x][y];
            this.secondBoard[x][y] = "";
            if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
          }

          aux_x = Number(x) + 2;
          aux_y = Number(y) - 1;
          if (aux_x <= 7 && aux_y >= 0 && (this.board[aux_x][aux_y] == "" || this.parseColour(this.board[aux_x][aux_y]) == 'w')) {
            this.copySecondBoard();
            this.secondBoard[aux_x][aux_y] = this.board[x][y];
            this.secondBoard[x][y] = "";
            if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
          }
        }
        break;
      case "rook":
        if (isWhite) {
          // Move up
          let i = y;
          var keep = true;
          do {
            i++;
            // Out of context
            if (i > 7) keep = false;
            // Next square is empty
            else if (this.board[x][i] == "") {
              this.copySecondBoard();
              this.secondBoard[x][i] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, i));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[x][i]) == 'b') {
              this.copySecondBoard();
              this.secondBoard[x][i] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, i));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[x][i]) == 'w') keep = false;
          } while (keep);

          // Move down
          i = y;
          keep = true;
          do {
            i--;
            // Out of context
            if (i < 0) keep = false;
            // Next square is empty
            else if (this.board[x][i] == "") {
              this.copySecondBoard();
              this.secondBoard[x][i] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, i));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[x][i]) == 'b') {
              this.copySecondBoard();
              this.secondBoard[x][i] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, i));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[x][i]) == 'w') keep = false;
          } while (keep);

          // Move right
          i = x;
          keep = true;
          do {
            i++;
            // Out of context
            if (i > 7) keep = false;
            // Next square is empty
            else if (this.board[i][y] == "") {
              this.copySecondBoard();
              this.secondBoard[i][y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(i, y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[i][y]) == 'b') {
              this.copySecondBoard();
              this.secondBoard[i][y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(i, y));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[i][y]) == 'w') keep = false;
          } while (keep);

          // Move left
          i = x;
          keep = true;
          do {
            i--;
            // Out of context
            if (i < 0) keep = false;
            // Next square is empty
            else if (this.board[i][y] == "") {
              this.copySecondBoard();
              this.secondBoard[i][y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(i, y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[i][y]) == 'b') {
              this.copySecondBoard();
              this.secondBoard[i][y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(i, y));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[i][y]) == 'w') keep = false;
          } while (keep);
        }
        else if (!(isWhite)) {
          // Move up
          let i = y;
          var keep = true;
          do {
            i++;
            // Out of context
            if (i > 7) keep = false;
            // Next square is empty
            else if (this.board[x][i] == "") {
              this.copySecondBoard();
              this.secondBoard[x][i] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, i));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[x][i]) == 'w') {
              this.copySecondBoard();
              this.secondBoard[x][i] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, i));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[x][i]) == 'b') keep = false;
          } while (keep);

          // Move down
          i = y;
          keep = true;
          do {
            i--;
            // Out of context
            if (i < 0) keep = false;
            // Next square is empty
            else if (this.board[x][i] == "") {
              this.copySecondBoard();
              this.secondBoard[x][i] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, i));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[x][i]) == 'w') {
              this.copySecondBoard();
              this.secondBoard[x][i] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, i));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[x][i]) == 'b') keep = false;
          } while (keep);

          // Move right
          i = x;
          keep = true;
          do {
            i++;
            // Out of context
            if (i > 7) keep = false;
            // Next square is empty
            else if (this.board[i][y] == "") {
              this.copySecondBoard();
              this.secondBoard[i][y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(i, y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[i][y]) == 'w') {
              this.copySecondBoard();
              this.secondBoard[i][y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(i, y));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[i][y]) == 'b') keep = false;
          } while (keep);

          // Move left
          i = x;
          keep = true;
          do {
            i--;
            // Out of context
            if (i < 0) keep = false;
            // Next square is empty
            else if (this.board[i][y] == "") {
              this.copySecondBoard();
              this.secondBoard[i][y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(i, y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[i][y]) == 'w') {
              this.copySecondBoard();
              this.secondBoard[i][y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(i, y));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[i][y]) == 'b') keep = false;
          } while (keep);
        }
        break;
      case "king":
        if (isWhite) {
          // Move up
          let i = y;
          i++;
          // Out of context
          if (i < 8) {
            // Next square is empty
            if (this.board[x][i] == "") {
              this.copySecondBoard();
              this.secondBoard[x][i] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, i));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[x][i]) == 'b') {
              this.copySecondBoard();
              this.secondBoard[x][i] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, i));
            }
          }


          // Move down
          i = y;
          i--;
          // Out of context
          if (i >= 0) {
            // Next square is empty
            if (this.board[x][i] == "") {
              this.copySecondBoard();
              this.secondBoard[x][i] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, i));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[x][i]) == 'b') {
              this.copySecondBoard();
              this.secondBoard[x][i] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, i));
            }
          }

          // Move right
          i = x;
          i++;
          // Out of context
          if (i < 8) {
            // Next square is empty
            if (this.board[i][y] == "") {
              this.copySecondBoard();
              this.secondBoard[i][y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(i, y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[i][y]) == 'b') {
              this.copySecondBoard();
              this.secondBoard[i][y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(i, y));
            }
          }

          // Move left
          i = x;
          i--;
          // Out of context
          if (i >= 0) {
            // Next square is empty
            if (this.board[i][y] == "") {
              this.copySecondBoard();
              this.secondBoard[i][y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(i, y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[i][y]) == 'b') {
              this.copySecondBoard();
              this.secondBoard[i][y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(i, y));
            }
          }

          // Move up left
          let aux_x = x;
          let aux_y = y;
          aux_x--;
          aux_y++;
          // Out of context
          if (aux_x >= 0 && aux_y < 8) {
            // Next square is empty
            if (this.board[aux_x][aux_y] == "") {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'b') {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
          }

          // Move up right
          aux_x = x;
          aux_y = y;
          aux_x++;
          aux_y++;
          if (aux_x < 8 && aux_y < 8) {
            // Next square is empty
            if (this.board[aux_x][aux_y] == "") {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'b') {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
          }

          // Move down left
          aux_x = x;
          aux_y = y;
          aux_x--;
          aux_y--;
          // Out of context
          if (aux_x >= 0 && aux_y >= 0) {
            // Next square is empty
            if (this.board[aux_x][aux_y] == "") {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'b') {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
          }

          // Move down right
          aux_x = x;
          aux_y = y;
          aux_x++;
          aux_y--;
          // Out of context
          if (aux_x < 8 && aux_y >= 0) {
            // Next square is empty
            if (this.board[aux_x][aux_y] == "") {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'b') {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
          }

          // Short castling
          aux_x = x;
          aux_y = y;
          let enroque_x = 7;
          let enroque_y = 0;
          let [enroque_color, enroque_pieceType] = this.parsePiece(this.board[enroque_x][enroque_y]);

          if (aux_x == 4 && aux_y == 0 && enroque_color == true && enroque_pieceType == "rook" && this.parseColour(this.board[5][0]) == 'e' && this.parseColour(this.board[6][0]) == 'e' && (this.whiteKing) && (this.whiteRook1)) {
            this.copySecondBoard();
            this.secondBoard[aux_x][aux_y] = "";
            this.secondBoard[6][0] = this.board[x][y];
            this.secondBoard[enroque_x][enroque_y] = "";
            this.secondBoard[5][0] = this.board[enroque_x][enroque_y];
            if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(6, enroque_y));
          }

          // Long castling
          enroque_x = 0;
          enroque_y = 0;
          [enroque_color, enroque_pieceType] = this.parsePiece(this.board[enroque_x][enroque_y]);

          if (aux_x == 4 && aux_y == 0 && enroque_color == true && enroque_pieceType == "rook" && this.parseColour(this.board[1][0]) == 'e' && this.parseColour(this.board[2][0]) == 'e' && this.parseColour(this.board[3][0]) == 'e' && (this.whiteKing) && (this.whiteRook2)) {
            this.copySecondBoard();
            this.secondBoard[aux_x][aux_y] = "";
            this.secondBoard[2][0] = this.board[x][y];
            this.secondBoard[enroque_x][enroque_y] = "";
            this.secondBoard[3][0] = this.board[enroque_x][enroque_y];
            if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(2, enroque_y));
          }
        }
        else if (!(isWhite)) {
          // Move up
          let i = y;
          i++;
          // Out of context
          if (i < 8) {
            // Next square is empty
            if (this.board[x][i] == "") {
              this.copySecondBoard();
              this.secondBoard[x][i] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, i));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[x][i]) == 'w') {
              this.copySecondBoard();
              this.secondBoard[x][i] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, i));
            }
          }


          // Move down
          i = y;
          i--;
          // Out of context
          if (i >= 0) {
            // Next square is empty
            if (this.board[x][i] == "") {
              this.copySecondBoard();
              this.secondBoard[x][i] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, i));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[x][i]) == 'w') {
              this.copySecondBoard();
              this.secondBoard[x][i] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, i));
            }
          }

          // Move right
          i = x;
          i++;
          // Out of context
          if (i < 8) {
            // Next square is empty
            if (this.board[i][y] == "") {
              this.copySecondBoard();
              this.secondBoard[i][y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(i, y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[i][y]) == 'w') {
              this.copySecondBoard();
              this.secondBoard[i][y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(i, y));
            }
          }

          // Move left
          i = x;
          i--;
          // Out of context
          if (i >= 0) {
            // Next square is empty
            if (this.board[i][y] == "") {
              this.copySecondBoard();
              this.secondBoard[i][y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(i, y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[i][y]) == 'w') {
              this.copySecondBoard();
              this.secondBoard[i][y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(i, y));
            }
          }

          // Move up left
          let aux_x = x;
          let aux_y = y;
          aux_x--;
          aux_y++;
          // Out of context
          if (aux_x >= 0 && aux_y < 8) {
            // Next square is empty
            if (this.board[aux_x][aux_y] == "") {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'w') {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
          }

          // Move up right
          aux_x = x;
          aux_y = y;
          aux_x++;
          aux_y++;
          if (aux_x < 8 && aux_y < 8) {
            // Next square is empty
            if (this.board[aux_x][aux_y] == "") {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'w') {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
          }

          // Move down left
          aux_x = x;
          aux_y = y;
          aux_x--;
          aux_y--;
          // Out of context
          if (aux_x >= 0 && aux_y >= 0) {
            // Next square is empty
            if (this.board[aux_x][aux_y] == "") {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'w') {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
          }

          // Move down right
          aux_x = x;
          aux_y = y;
          aux_x++;
          aux_y--;
          // Out of context
          if (aux_x < 8 && aux_y >= 0) {
            // Next square is empty
            if (this.board[aux_x][aux_y] == "") {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'w') {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
          }

          // Short castling
          aux_x = x;
          aux_y = y;
          let enroque_x = 7;
          let enroque_y = 7;
          let [enroque_color, enroque_pieceType] = this.parsePiece(this.board[enroque_x][enroque_y]);

          if (aux_x == 4 && aux_y == 7 && enroque_color == false && enroque_pieceType == "rook" && this.parseColour(this.board[5][7]) == 'e' && this.parseColour(this.board[6][7]) == 'e' && (this.blackKing) && (this.blackRook1)) {
            this.copySecondBoard();
            this.secondBoard[aux_x][aux_y] = "";
            this.secondBoard[6][7] = this.board[x][y];
            this.secondBoard[enroque_x][enroque_y] = "";
            this.secondBoard[5][7] = this.board[enroque_x][enroque_y];
            if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(6, enroque_y));
          }

          // Long castling
          enroque_x = 0;
          enroque_y = 7;
          [enroque_color, enroque_pieceType] = this.parsePiece(this.board[enroque_x][enroque_y]);

          if (aux_x == 4 && aux_y == 7 && enroque_color == false && enroque_pieceType == "rook" && this.parseColour(this.board[1][7]) == 'e' && this.parseColour(this.board[2][7]) == 'e' && this.parseColour(this.board[3][7]) == 'e' && (this.blackKing) && (this.blackRook2)) {
            this.copySecondBoard();
            this.secondBoard[aux_x][aux_y] = "";
            this.secondBoard[2][7] = this.board[x][y];
            this.secondBoard[enroque_x][enroque_y] = "";
            this.secondBoard[3][7] = this.board[enroque_x][enroque_y];
            if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(2, enroque_y));
          }
        }
        break;
      case "queen":
        if (isWhite) {
          // Move up
          let i = y;
          var keep = true;
          do {
            i++;
            // Out of context
            if (i > 7) keep = false;
            // Next square is empty
            else if (this.board[x][i] == "") {
              this.copySecondBoard();
              this.secondBoard[x][i] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, i));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[x][i]) == 'b') {
              this.copySecondBoard();
              this.secondBoard[x][i] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, i));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[x][i]) == 'w') keep = false;
          } while (keep);

          // Move down
          i = y;
          keep = true;
          do {
            i--;
            // Out of context
            if (i < 0) keep = false;
            // Next square is empty
            else if (this.board[x][i] == "") {
              this.copySecondBoard();
              this.secondBoard[x][i] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, i));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[x][i]) == 'b') {
              this.copySecondBoard();
              this.secondBoard[x][i] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, i));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[x][i]) == 'w') keep = false;
          } while (keep);

          // Move right
          i = x;
          keep = true;
          do {
            i++;
            // Out of context
            if (i > 7) keep = false;
            // Next square is empty
            else if (this.board[i][y] == "") {
              this.copySecondBoard();
              this.secondBoard[i][y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(i, y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[i][y]) == 'b') {
              this.copySecondBoard();
              this.secondBoard[i][y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(i, y));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[i][y]) == 'w') keep = false;
          } while (keep);

          // Move left
          i = x;
          keep = true;
          do {
            i--;
            // Out of context
            if (i < 0) keep = false;
            // Next square is empty
            else if (this.board[i][y] == "") {
              this.copySecondBoard();
              this.secondBoard[i][y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(i, y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[i][y]) == 'b') {
              this.copySecondBoard();
              this.secondBoard[i][y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(i, y));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[i][y]) == 'w') keep = false;
          } while (keep);

          // Move up left
          let aux_x = x;
          let aux_y = y;
          var keep = true;

          do {
            aux_x--;
            aux_y++;
            // Out of context
            if (aux_x < 0 || aux_y > 7) keep = false;
            // Next square is empty
            else if (this.board[aux_x][aux_y] == "") {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'b') {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'w') keep = false;
          } while (keep);

          // Move up right
          aux_x = x;
          aux_y = y;
          var keep = true;
          do {
            aux_x++;
            aux_y++;
            // Out of context
            if (aux_x > 7 || aux_y > 7) keep = false;
            // Next square is empty
            else if (this.board[aux_x][aux_y] == "") {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'b') {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'w') keep = false;
          } while (keep);

          // Move down left
          aux_x = x;
          aux_y = y;
          var keep = true;
          do {
            aux_x--;
            aux_y--;
            // Out of context
            if (aux_x < 0 || aux_y < 0) keep = false;
            // Next square is empty
            else if (this.board[aux_x][aux_y] == "") {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'b') {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'w') keep = false;
          } while (keep);

          // Move down right
          aux_x = x;
          aux_y = y;
          var keep = true;
          do {
            aux_x++;
            aux_y--;
            // Out of context
            if (aux_x > 7 || aux_y < 0) keep = false;
            // Next square is empty
            else if (this.board[aux_x][aux_y] == "") {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'b') {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'w') keep = false;
          } while (keep);

        }
        else if (!(isWhite)) {
          // Move up
          let i = y;
          var keep = true;
          do {
            i++;
            // Out of context
            if (i > 7) keep = false;
            // Next square is empty
            else if (this.board[x][i] == "") {
              this.copySecondBoard();
              this.secondBoard[x][i] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, i));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[x][i]) == 'w') {
              this.copySecondBoard();
              this.secondBoard[x][i] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, i));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[x][i]) == 'b') keep = false;
          } while (keep);

          // Move down
          i = y;
          keep = true;
          do {
            i--;
            // Out of context
            if (i < 0) keep = false;
            // Next square is empty
            else if (this.board[x][i] == "") {
              this.copySecondBoard();
              this.secondBoard[x][i] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, i));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[x][i]) == 'w') {
              this.copySecondBoard();
              this.secondBoard[x][i] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(x, i));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[x][i]) == 'b') keep = false;
          } while (keep);

          // Move right
          i = x;
          keep = true;
          do {
            i++;
            // Out of context
            if (i > 7) keep = false;
            // Next square is empty
            else if (this.board[i][y] == "") {
              this.copySecondBoard();
              this.secondBoard[i][y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(i, y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[i][y]) == 'w') {
              this.copySecondBoard();
              this.secondBoard[i][y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(i, y));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[i][y]) == 'b') keep = false;
          } while (keep);

          // Move left
          i = x;
          keep = true;
          do {
            i--;
            // Out of context
            if (i < 0) keep = false;
            // Next square is empty
            else if (this.board[i][y] == "") {
              this.copySecondBoard();
              this.secondBoard[i][y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(i, y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[i][y]) == 'w') {
              this.copySecondBoard();
              this.secondBoard[i][y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(i, y));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[i][y]) == 'b') keep = false;
          } while (keep);

          // Move up left
          let aux_x = x;
          let aux_y = y;
          var keep = true;
          do {
            aux_x--;
            aux_y++;
            // Out of context
            if (aux_x < 0 || aux_y > 7) keep = false;
            // Next square is empty
            else if (this.board[aux_x][aux_y] == "") {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'w') {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'b') keep = false;
          } while (keep);

          // Move up right
          aux_x = x;
          aux_y = y;
          var keep = true;
          do {
            aux_x++;
            aux_y++;
            // Out of context
            if (aux_x > 7 || aux_y > 7) keep = false;
            // Next square is empty
            else if (this.board[aux_x][aux_y] == "") {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'w') {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'b') keep = false;
          } while (keep);

          // Move down left
          aux_x = x;
          aux_y = y;
          var keep = true;
          do {
            aux_x--;
            aux_y--;
            // Out of context
            if (aux_x < 0 || aux_y < 0) keep = false;
            // Next square is empty
            else if (this.board[aux_x][aux_y] == "") {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'w') {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'b') keep = false;
          } while (keep);

          // Move down right
          aux_x = x;
          aux_y = y;
          var keep = true;
          do {
            aux_x++;
            aux_y--;
            // Out of context
            if (aux_x > 7 || aux_y < 0) keep = false;
            // Next square is empty
            else if (this.board[aux_x][aux_y] == "") {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'w') {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'b') keep = false;
          } while (keep);
        }
        break;
      case "bishop":
        if (isWhite) {
          // Move up left
          let aux_x = x;
          let aux_y = y;
          var keep = true;

          do {
            aux_x--;
            aux_y++;
            // Out of context
            if (aux_x < 0 || aux_y > 7) keep = false;
            // Next square is empty
            else if (this.board[aux_x][aux_y] == "") {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'b') {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'w') keep = false;
          } while (keep);

          // Move up right
          aux_x = x;
          aux_y = y;
          var keep = true;
          do {
            aux_x++;
            aux_y++;
            // Out of context
            if (aux_x > 7 || aux_y > 7) keep = false;
            // Next square is empty
            else if (this.board[aux_x][aux_y] == "") {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'b') {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'w') keep = false;
          } while (keep);

          // Move down left
          aux_x = x;
          aux_y = y;
          var keep = true;
          do {
            aux_x--;
            aux_y--;
            // Out of context
            if (aux_x < 0 || aux_y < 0) keep = false;
            // Next square is empty
            else if (this.board[aux_x][aux_y] == "") {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'b') {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'w') keep = false;
          } while (keep);

          // Move down right
          aux_x = x;
          aux_y = y;
          var keep = true;
          do {
            aux_x++;
            aux_y--;
            // Out of context
            if (aux_x > 7 || aux_y < 0) keep = false;
            // Next square is empty
            else if (this.board[aux_x][aux_y] == "") {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'b') {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineWhiteKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'w') keep = false;
          } while (keep);
        }
        else if (!(isWhite)) {
          // Move up left
          let aux_x = x;
          let aux_y = y;
          var keep = true;
          do {
            aux_x--;
            aux_y++;
            // Out of context
            if (aux_x < 0 || aux_y > 7) keep = false;
            // Next square is empty
            else if (this.board[aux_x][aux_y] == "") {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'w') {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'b') keep = false;
          } while (keep);

          // Move up right
          aux_x = x;
          aux_y = y;
          var keep = true;
          do {
            aux_x++;
            aux_y++;
            // Out of context
            if (aux_x > 7 || aux_y > 7) keep = false;
            // Next square is empty
            else if (this.board[aux_x][aux_y] == "") {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'w') {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'b') keep = false;
          } while (keep);

          // Move down left
          aux_x = x;
          aux_y = y;
          var keep = true;
          do {
            aux_x--;
            aux_y--;
            // Out of context
            if (aux_x < 0 || aux_y < 0) keep = false;
            // Next square is empty
            else if (this.board[aux_x][aux_y] == "") {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'w') {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'b') keep = false;
          } while (keep);

          // Move down right
          aux_x = x;
          aux_y = y;
          var keep = true;
          do {
            aux_x++;
            aux_y--;
            // Out of context
            if (aux_x > 7 || aux_y < 0) keep = false;
            // Next square is empty
            else if (this.board[aux_x][aux_y] == "") {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            // Next square has enemy
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'w') {
              this.copySecondBoard();
              this.secondBoard[aux_x][aux_y] = this.board[x][y];
              this.secondBoard[x][y] = "";
              if (!(examine) || !(this.examineBlackKingCheck(this.secondBoard))) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
              keep = false;
            }
            // Next square has allie
            else if (this.parseColour(this.board[aux_x][aux_y]) == 'b') keep = false;
          } while (keep);
        }
        break;
    }
  }

  // Seek White King position to get the coordenates.
  seekWhiteKingPosition(): string {
    let [isWhite, pieceType] = this.parsePiece(this.board[0][0]);
    let found = false;
    let i = 0;
    let x = 0;
    let y = 0;
    while (!(found)) {
      let j = 0;
      while (!(found) && j < 8) {
        let currentPiece = this.board[i][j];
        if (this.parseColour(currentPiece) != "e") {
          [isWhite, pieceType] = this.parsePiece(this.board[i][j]);
          if (isWhite && pieceType == "king") {
            found = true;
            x = i;
            y = j;
          }
        }
        j++;
      }
      i++;
    }
    // 100 % should entry there, because the king should be alive to play the game.
    return this.coordToCode(x, y);
  }

  // Seek White King position to get the coordenates.
  seekBlackKingPosition(): string {
    let [isWhite, pieceType] = this.parsePiece(this.board[0][0]);
    let found = false;
    let i = 0;
    let x = 0;
    let y = 0;
    while (!(found)) {
      let j = 0;
      while (!(found) && j < 8) {
        let currentPiece = this.board[i][j];
        if (this.parseColour(currentPiece) != "e") {
          [isWhite, pieceType] = this.parsePiece(this.board[i][j]);
          if (!(isWhite) && pieceType == "king") {
            found = true;
            x = i;
            y = j;
          }
        }
        j++;
      }
      i++;
    }
    // 100 % should entry there, because the king should be alive to play the game.
    return this.coordToCode(x, y);
  }

  // Examine king check
  examineWhiteKingCheck(boardToCheck: string[][]) {
    // Aquí copio board en un auxiliar
    this.copyBoard(this.auxBoard, this.board);
    // En board copio second
    this.copyBoard(this.board, this.secondBoard);
    let squareWhiteKingCode = this.seekWhiteKingPosition();
    let possibleMovesAux = this.possibleMoves;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let currentPiece = boardToCheck[i][j];
        if (this.parseColour(currentPiece) != 'e') {
          if (this.parseColour(currentPiece) == 'b') {
            this.setPossibleMoves(this.coordToCode(i, j), false);
            if (this.possibleMoves.includes(squareWhiteKingCode)) {
              this.possibleMoves = possibleMovesAux;
              // Copio auxiliar en board
              this.copyBoard(this.board, this.auxBoard);
              return true;
            }
            // Si el rey esta en el possibleMoves devuelve true
          }
        }
      }
    }
    this.possibleMoves = possibleMovesAux;
    // Copio auxiliar en board
    this.copyBoard(this.board, this.auxBoard);
    return false;
  }

  // Examine king check
  examineBlackKingCheck(boardToCheck: string[][]) {
    // Aquí copio board en un auxiliar
    this.copyBoard(this.auxBoard, this.board);
    // En board copio second
    this.copyBoard(this.board, this.secondBoard);
    let squareBlackKingCode = this.seekBlackKingPosition();
    let possibleMovesAux = this.possibleMoves;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let currentPiece = boardToCheck[i][j];
        if (this.parseColour(currentPiece) != 'e') {
          if (this.parseColour(currentPiece) == 'w') {
            this.setPossibleMoves(this.coordToCode(i, j), false);
            if (this.possibleMoves.includes(squareBlackKingCode)) {
              this.possibleMoves = possibleMovesAux;
              // Copio auxiliar en board
              this.copyBoard(this.board, this.auxBoard);
              return true;
            }
            // Si el rey esta en el possibleMoves devuelve true
          }
        }
      }
    }
    this.possibleMoves = possibleMovesAux;
    // Copio auxiliar en board
    this.copyBoard(this.board, this.auxBoard);
    return false;
  }

  // Examine black possible moves to verify jaque mate
  examineBlackPossibleMoves(boardToCheck: string[][]) {
    // Aquí copio board en un auxiliar
    this.copyBoard(this.auxBoard2, this.board);
    this.possibleMoves = [];
    let possibleMovesAux = this.possibleMoves;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let currentPiece = boardToCheck[i][j];
        if (this.parseColour(currentPiece) == 'b') {
          this.setPossibleMoves(this.coordToCode(i, j), true);
          if (this.possibleMoves.length > 0) {
            this.possibleMoves = possibleMovesAux;
            this.copyBoard(this.board, this.auxBoard2);
            return true;
          }
        }
      }
    }
    this.possibleMoves = possibleMovesAux;
    this.copyBoard(this.board, this.auxBoard2);
    return false;
  }

  // Examine white possible moves to verify jaque mate
  examineWhitePossibleMoves(boardToCheck: string[][]) {
    // Aquí copio board en un auxiliar
    this.copyBoard(this.auxBoard2, this.board);
    let possibleMovesAux = this.possibleMoves;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let currentPiece = boardToCheck[i][j];
        if (this.parseColour(currentPiece) == 'w') {
          this.setPossibleMoves(this.coordToCode(i, j), true);
          if (this.possibleMoves.length > 0) {
            // Aqui se pueden mover tanto no hay jaque mate 
            this.possibleMoves = possibleMovesAux;
            this.copyBoard(this.board, this.auxBoard2);
            return true;
          }
        }
      }
    }
    this.possibleMoves = possibleMovesAux;
    this.copyBoard(this.board, this.auxBoard2);
    return false;
  }


  // Changes possible move squares' colour 
  markHintSquares() {
    for (let i = 0; i < this.possibleMoves.length; i++) {
      let square = document.getElementById(this.possibleMoves[i]);
      square?.classList.add("blue_square");
    }
  }

  // Turns all hint squares back to normal
  resetHintSquares() {
    let elements = document.getElementsByClassName("blue_square");
    while (elements.length > 0) {
      elements[0].classList.remove("blue_square");
    }
  }

  //Used for debugging
  logBoard() {
    let boardString = "";
    for (let i = 7; i >= 0; i--) {
      for (let j = 0; j < 8; j++) {
        boardString += this.board[j][i];
        boardString += "\t";
      }
      boardString += "\n";
    }
    console.log(boardString);
  }

  // Transforms code "ln" where "l" is a letter and "n" is a number
  // to [x, y] coordinates, where x is represents n and y represents l
  codeToCoord(code: string): [number, number] {
    let charX = code.charAt(1);
    let charY = code.charAt(0);

    let x = charY.charCodeAt(0) - 97;
    let y = Number(charX) - 1;

    return [x, y];
  }

  // Transforms coord [x,y] into code "{a-h}{0-7}"
  coordToCode(x: number, y: number): string {
    let charX = 'a'.charCodeAt(0) + x;
    let charY = (y + 1).toString();

    return String.fromCharCode(charX) + charY;
  }

  // From the piece code (corresponding id in html) returns its color:
  // 'w' if it is white
  // 'b' if it is black
  // 'e' if it is empty
  parseColour(pieceCode: string): string {
    if (pieceCode == "") return 'e';
    else {
      var splitted = pieceCode.split("_", 2);
      let colour = 'w';
      if (splitted[0] === "black") {
        colour = 'b';
      }
      return colour;
    }
  }

  // From the piece code (corresponding id in html) returns its color and
  // its type
  parsePiece(pieceCode: string): [boolean, string] {
    var splitted = pieceCode.split("_", 2);
    var isWhite;
    var pieceType = splitted[1];
    if (splitted[0] === "black") {
      isWhite = false;
    } else isWhite = true;
    return [isWhite, pieceType];
  }

  // From the piece code (corresponding id in html) returns its color and
  // its type
  parsePieceComplete(pieceCode: string): [boolean, string] {
    var splitted = pieceCode.split("_", 3);
    var isWhite;
    var pieceType = splitted[1] + '_' + splitted[2];
    if (splitted[0] === "black") {
      isWhite = false;
    } else isWhite = true;
    return [isWhite, pieceType];
  }

  checkCastling(clicked: string): number {
    let [x, y] = this.codeToCoord(this.selected);
    let [x_clicked, y_clicked] = this.codeToCoord(clicked);
    let [enroque1_color, enroque1_pieceType] = this.parsePiece(this.board[7][0]);
    let [enroque2_color, enroque2_pieceType] = this.parsePiece(this.board[0][0]);
    let [enroque3_color, enroque3_pieceType] = this.parsePiece(this.board[7][7]);
    let [enroque4_color, enroque4_pieceType] = this.parsePiece(this.board[0][7]);
    console.log("CLICKED: " + x_clicked + " " + y_clicked);
    if (x == 4 && y == 0 && enroque1_color == true && enroque1_pieceType == "rook" && this.parseColour(this.board[5][0]) == 'e' && this.parseColour(this.board[6][0]) == 'e' && (this.whiteKing) && (this.whiteRook1) && x_clicked == 6 && y_clicked == 0) {
      return 1;
    } else if (x == 4 && y == 0 && enroque2_color == true && enroque2_pieceType == "rook" && this.parseColour(this.board[1][0]) == 'e' && this.parseColour(this.board[2][0]) == 'e' && this.parseColour(this.board[3][0]) == 'e' && (this.whiteKing) && (this.whiteRook2) && x_clicked == 2 && y_clicked == 0) {
      return 2;
    } else if (x == 4 && y == 7 && enroque3_color == false && enroque3_pieceType == "rook" && this.parseColour(this.board[5][7]) == 'e' && this.parseColour(this.board[6][7]) == 'e' && (this.blackKing) && (this.blackRook1) && x_clicked == 6 && y_clicked == 7) {
      return 3;
    } else if (x == 4 && y == 7 && enroque4_color == false && enroque4_pieceType == "rook" && this.parseColour(this.board[1][7]) == 'e' && this.parseColour(this.board[2][7]) == 'e' && this.parseColour(this.board[3][7]) == 'e' && (this.blackKing) && (this.blackRook2) && x_clicked == 2 && y_clicked == 7) {
      return 4;
    }
    return 0;
  }

  // Click controller 
  // Checks piece clicked matches current player's turn
  // Calls movePiece() if the move is allowed
  checkClick(clicked: string) {
    if (!this.choosingSummon && (this.playerIsWhite != this.turnWhite)) {
      if (this.selected === "") {
        let [x, y] = this.codeToCoord(clicked);
        let [color, pieceType] = this.parsePiece(this.board[x][y]);
        // Check if turn matches color and piece was clicked
        if (color === this.turnWhite && this.board[x][y] !== "") {
          this.selected = clicked;
          this.setPossibleMoves(this.selected, true);
          this.markHintSquares();
        }
      }
      else {
        // If destiny is in possible moves
        let possible = false;
        let [i, j] = this.codeToCoord(this.selected);
        let [x, y] = this.codeToCoord(clicked);

        if (this.possibleMoves.includes(clicked)) {
          // Aquí compruebo enroque para hacer dos movs.
          let checkCastling = this.checkCastling(clicked);
          console.log("Castling " + checkCastling);
          switch (checkCastling) {
            case 0:
              console.log("no hay enroque");
              this.movePiece(clicked);
              break;
            case 1:
              this.castling = true;
              this.movePiece(clicked);
              this.selected = "h1";
              this.movePiece("f1");
              break;
            case 2:
              this.castling = true;
              this.movePiece(clicked);
              this.selected = "a1";
              this.movePiece("d1");
              break;
            case 3:
              this.castling = true;
              this.movePiece(clicked);
              this.selected = "h8";
              this.movePiece("f8");
              break;
            case 4:
              this.castling = true;
              this.movePiece(clicked);
              this.selected = "a8";
              this.movePiece("d8");
              break;
          }
          let [isWhite, pieceType] = this.parsePieceComplete(this.board[x][y]); //ME QUEDO AQUI PARA PONERLE LOS BOOLEANOS SI SE MUEVEN
          console.log(pieceType);
          if (isWhite) {
            switch (pieceType) {
              case "rook_1":
                this.whiteRook1 = false;
                break;
              case "rook_2":
                this.whiteRook2 = false;
                break;
              case "king_1":
                this.whiteKing = false;
                break;
            }
          } else {
            switch (pieceType) {
              case "rook_1":
                this.blackRook1 = false;
                break;
              case "rook_2":
                this.blackRook2 = false;
                break;
              case "king_1":
                this.blackKing = false;
                break;
            }
          }
        }


        // Aquí habría que comprobar condición especial: peón final de tablero.
        let [white, thisPiece] = this.parsePiece(this.board[x][y]);
        if ((white == true && thisPiece == "pawn" && y == 7)) {
          this.choosingSummon = true;
          this.squareToSummon = clicked;
          this.showWhiteChoiceButtons();
        }
        if (white == false && thisPiece == "pawn" && y == 0) {
          this.choosingSummon = true;
          this.squareToSummon = clicked;
          this.showBlackChoiceButtons();
        }

        this.copyBoard(this.secondBoard, this.board);
        if (this.turnWhite) {
          if (this.examineWhiteKingCheck(this.board)) {
            // Avisar al enemigo blanco de jaque
            if (!(this.examineWhitePossibleMoves(this.board))) {
              console.log("Se acaba el juego, jaque mate al rey blanco");
            }
            // Avisar al enemigo negro de jaque
            else { console.log("Jaque al rey blanco"); }
            // Check de si es jaque mate mirando si las fichas de su color le pueden defender ( hay movimientos de su color ) hay que hacer funcion nueva
          }
          else {
            // Comprobar rey ahogado
            if (!(this.examineWhitePossibleMoves(this.board))) {
              console.log("Tablas, el rey blanco está ahogado");
            }
          }
        } else if (!(this.turnWhite)) {
          if (this.examineBlackKingCheck(this.board)) {
            // Avisar al enemigo negro de jaque mate
            if (!(this.examineBlackPossibleMoves(this.board))) {
              console.log("Se acaba el juego, jaque mate para los negros");
            }
            // Avisar al enemigo negro de jaque
            else { console.log("Jaque al rey negro"); }
          }
          else {
            // Comprobar rey negro ahogado
            if (!(this.examineBlackPossibleMoves(this.board))) {
              console.log("Tablas, el rey negro está ahogado");
            }
          }
        }
        this.selected = "";
        this.resetHintSquares();
      }
    }
  }

  showWhiteChoiceButtons() {
    var buttonContainer = document.getElementById("whiteChoiceButtonsContainer");
    if (buttonContainer != undefined) {
      buttonContainer.style.display = "block";
    }
  }

  showBlackChoiceButtons() {
    var buttonContainer = document.getElementById("blackChoiceButtonsContainer");
    if (buttonContainer != undefined) {
      buttonContainer.style.display = "block";
    }
  }

  hideChoiceButtons() {
    var buttonContainer = document.getElementById("whiteChoiceButtonsContainer");
    if (buttonContainer != undefined) {
      buttonContainer.style.display = "none";
    }
    var buttonContainer = document.getElementById("blackChoiceButtonsContainer");
    if (buttonContainer != undefined) {
      buttonContainer.style.display = "none";
    }
  }

  // Deletes all childs from a node
  removeChilds(parent: Node) {
    while (parent.lastChild) {
      parent.removeChild(parent.lastChild);
    }
  }

  // Swaps one piece into other type (used for pawn reaching end of the board)
  swapPiece(destType: string) {
    this.hideChoiceButtons();
    let [i, j] = this.codeToCoord(this.squareToSummon);
    this.board[i][j] = destType;

    var domDestiny = document.getElementById(this.squareToSummon);
    if (domDestiny != undefined) {
      this.removeChilds(domDestiny);
    }

    const newPieceImg = document.createElement('img');
    newPieceImg.setAttribute('src', "../../assets/defaultPieces/" + destType + ".png");
    newPieceImg.setAttribute('width', '40');

    const newPiece = document.createElement('span');
    newPiece.id = destType + "_" + this.queenCounter;
    newPiece.className = "piece";

    newPiece.appendChild(newPieceImg);
    domDestiny?.appendChild(newPiece);

    this.board[i][j] = destType + "_" + this.queenCounter;
    this.queenCounter++;
    this.knightCounter++;
    this.rookCounter++;
    this.bishopCounter++;
    this.choosingSummon = false;
  }

  // Moves piece to destiny
  movePiece(destiny: string) {
    let [i, j] = this.codeToCoord(this.selected);
    let [x, y] = this.codeToCoord(destiny);

    var domOriginPiece = document.getElementById(this.board[i][j]);
    var domDestiny = document.getElementById(destiny);

    if (this.board[x][y] != "") {
      // Normal move
      var domDestinyPiece = <Node>document.getElementById(this.board[x][y]);
      var pieceText = domDestinyPiece.textContent;


      let [color, _] = this.parsePiece(this.board[x][y]);
      if (color) {
        var cemetery = document.getElementById("cemeteryA");
      } else {
        var cemetery = document.getElementById("cemeteryB");
      }
      if (cemetery != undefined && pieceText != undefined) {
        cemetery.appendChild(<Node>domDestinyPiece);
      }
    }
    domDestiny?.appendChild(<Node>domOriginPiece);

    let piece = this.board[i][j];
    this.board[i][j] = "";
    this.board[x][y] = piece;
    if (!(this.castling)) { this.turnWhite = !this.turnWhite; }
    this.castling = false;

    axios
      .post('https://queenchess-backend.herokuapp.com/game/move', {
        x1: i,
        y1: j,
        x2: x,
        y2: y,
        gameId: this.matchId
      })
      .then((res) => {
        if (res.status === 200) {
          console.log("Back moved " + i+","+j + " to " + x +"," + y)
        } else {
          console.log("Move error: " + res.status);
        }
      })
      .catch((error) => {
        console.error(error);
      })

  }

  prueba() {
    console.log("HOLA");
  }


}
