import { Component } from "@angular/core";
import { Router } from "@angular/router";
import axios from 'axios';


@Component({
  selector: "history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.css"]
})
export class HistoryComponent {
  constructor(public router: Router) { }
  
  historial: string[] = [];




}

