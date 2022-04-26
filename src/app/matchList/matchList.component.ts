import { Component } from "@angular/core";
import { Router } from "@angular/router";
import axios from 'axios';

@Component({
  selector: "app-matchList",
  templateUrl: "./matchList.component.html",
  styleUrls: ["./matchList.component.css"]
})
export class MatchListComponent {
    constructor(public router: Router) {}
}