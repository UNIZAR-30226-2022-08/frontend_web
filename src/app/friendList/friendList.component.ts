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
    console.log(this.friendName);
    axios
    .post('https://queenchess-backend.herokuapp.com/account/addFriend', {
      friend: this.friendName
    })
    .then((res) => {
      if (res.status === 200) { 
      } else {
        console.log("login error: " + res.status);
      }
    })
    .catch((error) => {
      console.error(error);
    })
  }
  
}

