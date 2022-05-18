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
  friends: string[] = [];
  friendRequests : string[] = [];
  constructor(public router: Router) { }

  //This gets called after constructor (angular doesn't let you access elements in the constructor)
  ngOnInit() {
    axios
      .get('https://queenchess-backend.herokuapp.com/community/getFriends', {
      })
      .then((res) => {
        if (res.status === 200) {
          for (let i = 0; i < res.data.length; i++) {
            this.friends.push(res.data[i].FriendUsername);
          }
        } else {
          console.log("get friends error: " + res.status);
        }
      })
      .catch((error) => {
        console.error(error);
      })

      axios
      .get('https://queenchess-backend.herokuapp.com/community/getFriendRequests', {
      })
      .then((res) => {
        if (res.status === 200) {
          for (let i = 0; i < res.data.length; i++) {
            this.friends.push(res.data[i].FriendUsername); 
            console.log(res.data[i].FriendUsername);
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
      .put('https://queenchess-backend.herokuapp.com/community/addFriend', {
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

  acceptFriendRequest(name: string) {
    console.log("Accepting " + name);
    axios
      .put('https://queenchess-backend.herokuapp.com/account/acceptFriendRequest', {
        friend: name
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

  removeFriend(name: string) {
    console.log("Removing " + name);
    axios
      .delete('https://queenchess-backend.herokuapp.com/community/removeFriend', {
        data: {friend: name}
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

