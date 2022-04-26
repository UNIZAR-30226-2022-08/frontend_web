import { Component } from "@angular/core";
import { Router } from "@angular/router";
import axios from 'axios';

@Component({
  selector: "app-friend",
  templateUrl: "./friendList.component.html",
  styleUrls: ["./friendList.component.css"]
})
export class FriendListComponent {
  constructor(public router: Router) {}
}