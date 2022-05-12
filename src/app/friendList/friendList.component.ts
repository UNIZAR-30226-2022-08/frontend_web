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
    this.friends.push("menganito");
    this.friends.push("fulanito");
    axios
      .get('https://queenchess-backend.herokuapp.com/account/getFriends', {
      })
      .then((res) => {
        if (res.status === 200) {
          for (let i = 0; i < res.data.length; i++) {
            this.friends.push(res.data[i][1]);
          }
        } else {
          console.log("get friends error: " + res.status);
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }

  addFriend() {
    console.log("Adding " + this.friendName);
    axios
      .put('https://queenchess-backend.herokuapp.com/account/addFriend', {
        friend: this.friendName
      })
      .then((res) => {
        if (res.status === 200) {
        } else {
          console.log("addfriend error: " + res.status);
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }

  removeFriend(friendName: string) {
    console.log("Removing " + friendName);
    axios
      .delete('https://queenchess-backend.herokuapp.com/community/removeFriend', {
        data: {friend: this.friendName}
      })
      .then((res) => {
        if (res.status === 200) {
        } else {
          console.log("delete error: " + res.status);
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }

  chat(friendName: string) {
    console.log(friendName);
    this.router.navigate(['/chat']);
  }

}

