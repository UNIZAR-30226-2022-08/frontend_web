import { Component } from "@angular/core";
import { Router } from "@angular/router";
import axios from 'axios';

@Component({
  selector: "app-friend",
  templateUrl: "./friendList.component.html",
  styleUrls: ["./friendList.component.css"]
})
export class FriendListComponent {
  friendName: string;
  constructor(public router: Router) { }
  
  //This gets called after constructor (angular doesn't let you access elements in the constructor)
  ngOnInit() {
    
  }

  addFriend() {

  }
  
}

