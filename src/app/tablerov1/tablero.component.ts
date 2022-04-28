import { Component } from "@angular/core";
import { HAMMER_LOADER } from "@angular/platform-browser";
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
  possibleMoves: string[] = [];
  possibleMovesToCheckWhiteKing: string[] = [];

  // Removes all pieces from board
  clearBoard() {
    for (let i = 0; i <= 8; i++) {
      for (let j = 0; j <= 8; j++) {
        this.board[i][j] = "";
      }
    }
  }

  // Back-end should initialize board?
  startGame() {
    this.board = [];
    for (let i = 0; i < 8; i++) {
      this.board[i] = [];
      for (let j = 0; j < 8; j++) {
        if (j == 0) {
          this.board[i][j] = "white_" + this.initialRow[i];
        }
        else if (j == 7) {
          this.board[i][j] = "black_" + this.initialRow[i];
        }
        else if (j == 1) {
          this.board[i][j] = "white_pawn_" + String.fromCharCode(i + 1 + '0'.charCodeAt(0));
        }
        else if (j == 6) {
          this.board[i][j] = "black_pawn_" + String.fromCharCode(i + 1 + '0'.charCodeAt(0));
        }
        else this.board[i][j] = "";
      }
    }
    this.logBoard();
  }

  
  // Calculates and stores all possible moves in the possibleMoves array
    // Calculates and stores all possible moves in the possibleMoves array
    setPossibleMoves(squareCode: string) {
      this.possibleMoves = []; 
      let [x, y] = this.codeToCoord(squareCode);
      let [isWhite, pieceType] = this.parsePiece(this.board[x][y]);
      console.log("Tipo:" + pieceType);
      let newBoard = this.board;
      switch (pieceType) {
        case "pawn":
          if (isWhite) {
            // The square in front of the pawn is empty
            if (this.board[x][y+1] == "") {
              this.possibleMoves.push(this.coordToCode(x,y+1));
            }
            // The pawn is in the starting square and the two in front are empty
            if (this.board[x][y+2] == "" && y == 1) {
              this.possibleMoves.push(this.coordToCode(x,y+2));
            }
            // Eat right diagonal
            if (x < 7 && y < 7 && this.parseColour(this.board[x+1][y+1]) == 'b'){
              this.possibleMoves.push(this.coordToCode(x+1,y+1));
            }
            // Eat left diagonal
            if (x > 0 && y < 7 && this.parseColour(this.board[x-1][y+1]) == 'b'){
              newBoard = this.board;
              newBoard[x][y] = "";
              newBoard[x-1][y+1] = this.board[x][y];
              if (!(this.examineKingCheckWhite(newBoard))) this.possibleMoves.push(this.coordToCode(x-1,y+1));
            }

          }
          else if (!(isWhite)) {
            // The square in front of the pawn is empty
            if (this.board[x][y-1] == "") {
              this.possibleMoves.push(this.coordToCode(x,y-1));
            }
            // The pawn is in the starting square and the two in front are empty
            if (this.board[x][y-2] == "" && y == 6) {
              this.possibleMoves.push(this.coordToCode(x,y-2));
            }
            // Eat right diagonal
            if (x < 7 && y > 0 && this.parseColour(this.board[x+1][y-1]) == 'w'){
              this.possibleMoves.push(this.coordToCode(x+1,y-1));
            }
            // Eat left diagonal
            if (x > 0 && y > 0 && this.parseColour(this.board[x-1][y-1]) == 'w'){
              this.possibleMoves.push(this.coordToCode(x-1,y-1));
            }
          }
          //let code = this.coordToCode(x,y+1);
          //console.log("A marcar:" + code);
          //this.possibleMoves.push(code);
        break;
        case "knight": 
          if (isWhite) {
  
            let aux_x = x;
            let aux_y = y;
  
            // Move up left
            aux_x = Number(x) - 1;
            aux_y = Number(y) + 2;
            if (aux_x >= 0 && aux_y < 8) {
              if (this.board[aux_x][aux_y] == "" || this.parseColour(this.board[aux_x][aux_y]) == 'b') this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
            
            aux_x = Number(x) - 2;
            aux_y = Number(y) + 1;
            if (aux_x >= 0 && aux_y < 8){
              if (this.board[aux_x][aux_y] == "" || this.parseColour(this.board[aux_x][aux_y]) == 'b') this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            } 
  
            // Move up right
            aux_x = Number(x) + 1;
            aux_y = Number(y) + 2;
            if (aux_x < 8 && aux_y < 8) {
              if (this.board[aux_x][aux_y] == "" || this.parseColour(this.board[aux_x][aux_y]) == 'b') this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            } 
            
            aux_x = Number(x) + 2;
            aux_y = Number(y) + 1;        
            if (aux_x < 8 && aux_y < 8) {
              if (this.board[aux_x][aux_y] == "" || this.parseColour(this.board[aux_x][aux_y]) == 'b') this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
  
            // Move down left
            aux_x = Number(x) - 1;
            aux_y = Number(y) - 2;  
            if (aux_x >= 0 && aux_y >= 0) {
              if (this.board[aux_x][aux_y] == "" || this.parseColour(this.board[aux_x][aux_y]) == 'b') this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            }
           
            
            aux_x = Number(x) - 2;
            aux_y = Number(y) - 1;  
            if (aux_x >= 0 && aux_y >= 0 && (this.board[aux_x][aux_y] == "" || this.parseColour(this.board[aux_x][aux_y]) == 'b')) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
  
            // Move down right
            aux_x = Number(x) + 1;
            aux_y = Number(y) - 2;  
            if (aux_x < 8 && aux_y < 8 && (this.board[aux_x][aux_y] == "" || this.parseColour(this.board[aux_x][aux_y]) == 'b')) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
            
            aux_x = Number(x) + 2;
            aux_y = Number(y) - 1;  
            if (aux_x < 8 && aux_y >= 0 && (this.board[aux_x][aux_y] == "" || this.parseColour(this.board[aux_x][aux_y]) == 'b')) this.possibleMoves.push(this.coordToCode(aux_x, aux_y));
          }
          
          else if (!(isWhite)) {
            // Move up left
            if (x-- > 0 && y+2 < 8 && this.board[x--][y+2] == "" || this.parseColour(this.board[x--][y+2]) == 'w') this.possibleMoves.push(this.coordToCode(x--, y+2));
            if (x-2 > 0 && y++ < 8 && this.board[x-2][y++] == "" || this.parseColour(this.board[x-2][y++]) == 'w') this.possibleMoves.push(this.coordToCode(x-2, y++));
  
            // Move up right
            if (x++ < 8 && y+2 < 8 && this.board[x++][y+2] == "" || this.parseColour(this.board[x++][y+2]) == 'w') this.possibleMoves.push(this.coordToCode(x++, y+2));
            if (x+2 < 8 && y++ < 8 && this.board[x+2][y++] == "" || this.parseColour(this.board[x+2][y++]) == 'w') this.possibleMoves.push(this.coordToCode(x+2, y++));
  
            // Move down left
            if (x-- > 0 && y-2 > 0 && this.board[x--][y-2] == "" || this.parseColour(this.board[x--][y-2]) == 'w') this.possibleMoves.push(this.coordToCode(x--, y-2));
            if (x-2 > 0 && y-- > 0 && this.board[x-2][y--] == "" || this.parseColour(this.board[x-2][y--]) == 'w') this.possibleMoves.push(this.coordToCode(x-2, y--));
  
            // Move down right
            if (x++ < 8 && y-2 > 0 && this.board[x++][y-2] == "" || this.parseColour(this.board[x++][y-2]) == 'w') this.possibleMoves.push(this.coordToCode(x++, y-2));
            if (x+2 < 8 && y-- > 0 && this.board[x+2][y--] == "" || this.parseColour(this.board[x+2][y--]) == 'w') this.possibleMoves.push(this.coordToCode(x+2, y--)); 
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
              else if (this.board[x][i] == "") this.possibleMoves.push(this.coordToCode(x,i));
              // Next square has enemy
              else if (this.parseColour(this.board[x][i]) == 'b'){
                this.possibleMoves.push(this.coordToCode(x,i));
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
              else if (this.board[x][i] == "") this.possibleMoves.push(this.coordToCode(x,i));
              // Next square has enemy
              else if (this.parseColour(this.board[x][i]) == 'b'){
                this.possibleMoves.push(this.coordToCode(x,i));
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
              else if (this.board[i][y] == "") this.possibleMoves.push(this.coordToCode(i,y));
              // Next square has enemy
              else if (this.parseColour(this.board[i][y]) == 'b'){
                this.possibleMoves.push(this.coordToCode(i,y));
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
              else if (this.board[i][y] == "") this.possibleMoves.push(this.coordToCode(i,y));
              // Next square has enemy
              else if (this.parseColour(this.board[i][y]) == 'b'){
                this.possibleMoves.push(this.coordToCode(i,y));
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
              else if (this.board[x][i] == "") this.possibleMoves.push(this.coordToCode(x,i));
              // Next square has enemy
              else if (this.parseColour(this.board[x][i]) == 'w'){
                this.possibleMoves.push(this.coordToCode(x,i));
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
              else if (this.board[x][i] == "") this.possibleMoves.push(this.coordToCode(x,i));
              // Next square has enemy
              else if (this.parseColour(this.board[x][i]) == 'w'){
                this.possibleMoves.push(this.coordToCode(x,i));
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
              else if (this.board[i][y] == "") this.possibleMoves.push(this.coordToCode(i,y));
              // Next square has enemy
              else if (this.parseColour(this.board[i][y]) == 'w'){
                this.possibleMoves.push(this.coordToCode(i,y));
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
              else if (this.board[i][y] == "") this.possibleMoves.push(this.coordToCode(i,y));
              // Next square has enemy
              else if (this.parseColour(this.board[i][y]) == 'w'){
                this.possibleMoves.push(this.coordToCode(i,y));
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
              // AQUÍ SE DEBE COMPROBAR SI ESTE MOVIMIENTO LE PONE EN HACKE, PORQUE SERÍA HACKE MATE.
              // Next square is empty
              if (this.board[x][i] == "") this.possibleMoves.push(this.coordToCode(x,i));
              // Next square has enemy
              else if (this.parseColour(this.board[x][i]) == 'b') this.possibleMoves.push(this.coordToCode(x,i));
            }
            
  
            // Move down
            i = y;
            keep = true; 
            do {
              i--;
              // Out of context
              if (i < 0) keep = false;
              // Next square is empty
              else if (this.board[x][i] == "") this.possibleMoves.push(this.coordToCode(x,i));
              // Next square has enemy
              else if (this.parseColour(this.board[x][i]) == 'b'){
                this.possibleMoves.push(this.coordToCode(x,i));
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
              else if (this.board[i][y] == "") this.possibleMoves.push(this.coordToCode(i,y));
              // Next square has enemy
              else if (this.parseColour(this.board[i][y]) == 'b'){
                this.possibleMoves.push(this.coordToCode(i,y));
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
              else if (this.board[i][y] == "") this.possibleMoves.push(this.coordToCode(i,y));
              // Next square has enemy
              else if (this.parseColour(this.board[i][y]) == 'b'){
                this.possibleMoves.push(this.coordToCode(i,y));
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
              else if (this.board[aux_x][aux_y] == "") this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
              // Next square has enemy
              else if (this.parseColour(this.board[aux_x][aux_y]) == 'b'){
                this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
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
              else if (this.board[aux_x][aux_y] == "") this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
              // Next square has enemy
              else if (this.parseColour(this.board[aux_x][aux_y]) == 'b'){
                this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
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
              else if (this.board[aux_x][aux_y] == "") this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
              // Next square has enemy
              else if (this.parseColour(this.board[aux_x][aux_y]) == 'b'){
                this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
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
              else if (this.board[aux_x][aux_y] == "") this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
              // Next square has enemy
              else if (this.parseColour(this.board[aux_x][aux_y]) == 'b'){
                this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
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
              else if (this.board[x][i] == "") this.possibleMoves.push(this.coordToCode(x,i));
              // Next square has enemy
              else if (this.parseColour(this.board[x][i]) == 'w'){
                this.possibleMoves.push(this.coordToCode(x,i));
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
              else if (this.board[x][i] == "") this.possibleMoves.push(this.coordToCode(x,i));
              // Next square has enemy
              else if (this.parseColour(this.board[x][i]) == 'w'){
                this.possibleMoves.push(this.coordToCode(x,i));
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
              else if (this.board[i][y] == "") this.possibleMoves.push(this.coordToCode(i,y));
              // Next square has enemy
              else if (this.parseColour(this.board[i][y]) == 'w'){
                this.possibleMoves.push(this.coordToCode(i,y));
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
              else if (this.board[i][y] == "") this.possibleMoves.push(this.coordToCode(i,y));
              // Next square has enemy
              else if (this.parseColour(this.board[i][y]) == 'w'){
                this.possibleMoves.push(this.coordToCode(i,y));
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
             else if (this.board[aux_x][aux_y] == "") this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
             // Next square has enemy
             else if (this.parseColour(this.board[aux_x][aux_y]) == 'w'){
               this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
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
             else if (this.board[aux_x][aux_y] == "") this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
             // Next square has enemy
             else if (this.parseColour(this.board[aux_x][aux_y]) == 'w'){
               this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
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
             else if (this.board[aux_x][aux_y] == "") this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
             // Next square has enemy
             else if (this.parseColour(this.board[aux_x][aux_y]) == 'w'){
               this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
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
             else if (this.board[aux_x][aux_y] == "") this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
             // Next square has enemy
             else if (this.parseColour(this.board[aux_x][aux_y]) == 'w'){
               this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
               keep = false;
             }
             // Next square has allie
             else if (this.parseColour(this.board[aux_x][aux_y]) == 'b') keep = false;
           } while (keep);
  
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
              else if (this.board[x][i] == "") this.possibleMoves.push(this.coordToCode(x,i));
              // Next square has enemy
              else if (this.parseColour(this.board[x][i]) == 'b'){
                this.possibleMoves.push(this.coordToCode(x,i));
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
              else if (this.board[x][i] == "") this.possibleMoves.push(this.coordToCode(x,i));
              // Next square has enemy
              else if (this.parseColour(this.board[x][i]) == 'b'){
                this.possibleMoves.push(this.coordToCode(x,i));
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
              else if (this.board[i][y] == "") this.possibleMoves.push(this.coordToCode(i,y));
              // Next square has enemy
              else if (this.parseColour(this.board[i][y]) == 'b'){
                this.possibleMoves.push(this.coordToCode(i,y));
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
              else if (this.board[i][y] == "") this.possibleMoves.push(this.coordToCode(i,y));
              // Next square has enemy
              else if (this.parseColour(this.board[i][y]) == 'b'){
                this.possibleMoves.push(this.coordToCode(i,y));
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
              else if (this.board[aux_x][aux_y] == "") this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
              // Next square has enemy
              else if (this.parseColour(this.board[aux_x][aux_y]) == 'b'){
                this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
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
              else if (this.board[aux_x][aux_y] == "") this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
              // Next square has enemy
              else if (this.parseColour(this.board[aux_x][aux_y]) == 'b'){
                this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
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
              else if (this.board[aux_x][aux_y] == "") this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
              // Next square has enemy
              else if (this.parseColour(this.board[aux_x][aux_y]) == 'b'){
                this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
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
              else if (this.board[aux_x][aux_y] == "") this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
              // Next square has enemy
              else if (this.parseColour(this.board[aux_x][aux_y]) == 'b'){
                this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
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
              else if (this.board[x][i] == "") this.possibleMoves.push(this.coordToCode(x,i));
              // Next square has enemy
              else if (this.parseColour(this.board[x][i]) == 'w'){
                this.possibleMoves.push(this.coordToCode(x,i));
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
              else if (this.board[x][i] == "") this.possibleMoves.push(this.coordToCode(x,i));
              // Next square has enemy
              else if (this.parseColour(this.board[x][i]) == 'w'){
                this.possibleMoves.push(this.coordToCode(x,i));
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
              else if (this.board[i][y] == "") this.possibleMoves.push(this.coordToCode(i,y));
              // Next square has enemy
              else if (this.parseColour(this.board[i][y]) == 'w'){
                this.possibleMoves.push(this.coordToCode(i,y));
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
              else if (this.board[i][y] == "") this.possibleMoves.push(this.coordToCode(i,y));
              // Next square has enemy
              else if (this.parseColour(this.board[i][y]) == 'w'){
                this.possibleMoves.push(this.coordToCode(i,y));
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
             else if (this.board[aux_x][aux_y] == "") this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
             // Next square has enemy
             else if (this.parseColour(this.board[aux_x][aux_y]) == 'w'){
               this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
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
             else if (this.board[aux_x][aux_y] == "") this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
             // Next square has enemy
             else if (this.parseColour(this.board[aux_x][aux_y]) == 'w'){
               this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
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
             else if (this.board[aux_x][aux_y] == "") this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
             // Next square has enemy
             else if (this.parseColour(this.board[aux_x][aux_y]) == 'w'){
               this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
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
             else if (this.board[aux_x][aux_y] == "") this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
             // Next square has enemy
             else if (this.parseColour(this.board[aux_x][aux_y]) == 'w'){
               this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
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
              else if (this.board[aux_x][aux_y] == "") this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
              // Next square has enemy
              else if (this.parseColour(this.board[aux_x][aux_y]) == 'b'){
                this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
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
              else if (this.board[aux_x][aux_y] == "") this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
              // Next square has enemy
              else if (this.parseColour(this.board[aux_x][aux_y]) == 'b'){
                this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
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
              else if (this.board[aux_x][aux_y] == "") this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
              // Next square has enemy
              else if (this.parseColour(this.board[aux_x][aux_y]) == 'b'){
                this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
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
              else if (this.board[aux_x][aux_y] == "") this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
              // Next square has enemy
              else if (this.parseColour(this.board[aux_x][aux_y]) == 'b'){
                this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
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
              else if (this.board[aux_x][aux_y] == "") this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
              // Next square has enemy
              else if (this.parseColour(this.board[aux_x][aux_y]) == 'w'){
                this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
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
              else if (this.board[aux_x][aux_y] == "") this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
              // Next square has enemy
              else if (this.parseColour(this.board[aux_x][aux_y]) == 'w'){
                this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
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
              else if (this.board[aux_x][aux_y] == "") this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
              // Next square has enemy
              else if (this.parseColour(this.board[aux_x][aux_y]) == 'w'){
                this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
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
              else if (this.board[aux_x][aux_y] == "") this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
              // Next square has enemy
              else if (this.parseColour(this.board[aux_x][aux_y]) == 'w'){
                this.possibleMoves.push(this.coordToCode(aux_x,aux_y));
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
    while(!(found)) {
        for (let j = 0; j < 8; j++) {
          if (this.board[i][j] ! = "") {
            [isWhite, pieceType] = this.parsePiece(this.board[i][j]);
            if (isWhite && pieceType == "King"){
              found = true;
              x = i;
              y = j;
          }
         }
        }
        i++;
      }
    // 100 % should entry there, because the king should be alive to play the game.
    return this.coordToCode(x,y);
    }


  // Examine king check
  examineKingCheckWhite(boardToCheck : string[][]) {
    let squareWhiteKingCode = this.seekWhiteKingPosition();
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let currentPiece = boardToCheck[i][j];
        if (currentPiece != ""){
          if (this.parseColour(currentPiece) == 'b') {
            this.possibleMovesToCheckWhiteKing = [];
            this.setPossibleMoves(currentPiece);
            


              }
            }



          }


        }
        return true;
      }


  // Changes possible move squares' colour 
  markHintSquares() {
    for (let i = 0; i < this.possibleMoves.length; i++) {
      let square = document.getElementById(this.possibleMoves[i]);
      square?.classList.add("blue_square");
      console.log("Marked " + this.possibleMoves[i] + " as hint");
    }
  }

  // Turns all hint squares back to normal
  resetHintSquares() {
    let elements = document.getElementsByClassName("blue_square");
    while (elements.length > 0) {
      console.log("length: " + elements.length);
      elements[0].classList.remove("blue_square");
      console.log("Hint square deleted");
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

    console.log(x);
    console.log(y);
    return [x, y];
  }

  // Transforms coord [x,y] into code "{a-h}{0-7}"
  coordToCode(x: number, y: number): string {
    let charX = 'a'.charCodeAt(0) + x;
    let charY = (y+1).toString();

    return String.fromCharCode(charX)+charY;
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
    console.log("parse:" + isWhite + pieceType);
    return [isWhite, pieceType];
  }

  // Click controller 
  // Checks piece clicked matches current player's turn
  // Calls movePiece() if the move is allowed
  checkClick(clicked: string) {
    if (this.selected === "") {
      console.log("Clicked square: " + clicked);
      let [x, y] = this.codeToCoord(clicked);
      let [color, pieceType] = this.parsePiece(this.board[x][y]);
      // Check if turn matches color and piece was clicked
      if (color === this.turnWhite && this.board[x][y] !== "") {
        this.selected = clicked;
        this.setPossibleMoves(this.selected);
        this.markHintSquares();
        console.log(this.selected);
      }
    }
    else {
      // If destiny is in possible moves
      let [i, j] = this.codeToCoord(this.selected);
      let [x, y] = this.codeToCoord(clicked);
      if (this.board[i][j] !== "" && (this.board[i][j] !== this.board[x][y])) {
        this.movePiece(clicked);
      }
      // Dependiendo del turno, hay que verificar el hacke del contrario. Falta añadir la función.
      this.selected = "";
      this.resetHintSquares();
    }
  }

  // Moves piece to destiny
  movePiece(destiny: string) {
    let [i, j] = this.codeToCoord(this.selected);
    let [x, y] = this.codeToCoord(destiny);

    console.log("Origin" + this.board[i][j]);
    console.log("Destiny" + this.board[x][y]);

    var domOriginPiece = document.getElementById(this.board[i][j]);
    console.log(domOriginPiece);
    var domDestiny = document.getElementById(destiny);

    if (this.board[x][y] != "") { // Destroy piece that was in destiny
      var domDestinyPiece = <Node>document.getElementById(this.board[x][y]);
      var pieceText = domDestinyPiece.textContent;


      let [color, _] = this.parsePiece(this.board[x][y]);
      if (color) {
        var cemetery = document.getElementById("cemeteryA");
      } else {
        var cemetery = document.getElementById("cemeteryB");
      }
      if (cemetery != undefined && pieceText != undefined) {
        cemetery.textContent += pieceText;
      }
      domDestinyPiece?.parentNode?.removeChild(domDestinyPiece);
    }
    domDestiny?.appendChild(<Node>domOriginPiece);

    let piece = this.board[i][j];
    this.board[i][j] = "";
    this.board[x][y] = piece;
    this.turnWhite = !this.turnWhite;
  }

  prueba() {
    console.log("HOLA");
  }


}
