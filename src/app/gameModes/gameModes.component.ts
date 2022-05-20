import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-gameModes",
  templateUrl: "./gameModes.component.html",
  styleUrls: ["./gameModes.component.css"]
})
export class GameModesComponent {
  constructor(public router: Router) {
  }

  startLocalGame() {
    this.router.navigate(['/tablero']);
  }

  startAsyncGame() {
    this.router.navigate(['/tableroAsincrono']);
  }

  startSyncGame() {
    this.router.navigate(['/tableroSincrono']);
  }
  
}