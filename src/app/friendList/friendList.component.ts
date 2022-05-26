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
    .get('https://queenchess-backend.herokuapp.com/account/checkSession', {
    })
    .then((res) => {
      if (res.status === 200) {
        localStorage.setItem("user", res.data.response.username);
        localStorage.setItem("email", res.data.response.email);
        console.log("Response session data: " + res.data);
        console.log("Storing username: " + localStorage.getItem("user"));
      } else if (res.status === 400) {
        localStorage.clear();
        console.log("check session error: " + res.status);
        this.router.navigateByUrl('/home');
      }
    })
    .catch((error) => {
      console.error(error);
    })
    
    axios
      .get('https://queenchess-backend.herokuapp.com/community/getFriends', {
      })
      .then((res) => {
        if (res.status === 200) {
          for (let i = 0; i < res.data.response.length; i++) {
            this.friends.push(res.data.response[i]);
            console.log("Friend " + res.data.response[i]);
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
          for (let i = 0; i < res.data.response.length; i++) {
            this.friendRequests.push(res.data.response[i]); 
            console.log("Request " + res.data.response[i]);
          }
        } else {
          console.log("get friendRequests error: " + res.status);
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
      .put('https://queenchess-backend.herokuapp.com/community/acceptFriendRequest', {
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

  removeFriend(friendName: string) {
    console.log("Removing " + name);
    axios
      .delete('https://queenchess-backend.herokuapp.com/community/removeFriend', {
        data: {friend: friendName}
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

  challenge(friendName: string) {
    console.log("Challenging " + friendName);
    axios
      .put('https://queenchess-backend.herokuapp.com/game/newAsyncGame', {
        whitePlayer: localStorage.getItem("user"),
        blackPlayer: friendName
      })
      .then((res) => {
        if (res.status === 200) {
          this.router.navigate(['/tableroAsincrono/'],
          {
            queryParams: { matchId: res.data.response.id }
          });
          
        } else {
          console.log("Challenge error: " + res.status);
        }
      })
      .catch((error) => {
        console.error(error);
      })
  }

  challengeSync(friendName: string) {
    console.log("Challenging " + friendName);
    axios
      .put('https://queenchess-backend.herokuapp.com/game/newSyncGame', {
        whitePlayer: localStorage.getItem("user"),
        blackPlayer: friendName
      })
      .then((res) => {
        if (res.status === 200) {
          this.router.navigate(['/tableroSincrono/'],
          {
            queryParams: { matchId: res.data.response.id }
          });
          
        } else {
          console.log("Challenge error: " + res.status);
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

