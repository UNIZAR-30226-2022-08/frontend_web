import { Component } from "@angular/core";
import { Router } from "@angular/router";
import axios from 'axios';
import { FRIENDS } from './mock-friends'

@Component({
  selector: "app-friend",
  templateUrl: "./friendList.component.html",
  styleUrls: ["./friendList.component.css"]
})
export class FriendListComponent {
  friendName: string;
  friends = FRIENDS;
  constructor(public router: Router) { }

  //This gets called after constructor (angular doesn't let you access elements in the constructor)
  ngOnInit() {
    axios
      .get('https://queenchess-backend.herokuapp.com/account/getFriends', {
      })
      .then((res) => {
        if (res.status === 200) {
          res.data.array.forEach((element: any) => {
            this.friends.push(element.FriendUserName);
          });
          this.friends = (res.data);
        } else {
          console.log("login error: " + res.status);
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }

  addFriend() {
    console.log(this.friendName);
    axios
      .put('https://queenchess-backend.herokuapp.com/account/addFriend', {
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

