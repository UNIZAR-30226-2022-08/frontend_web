import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { ChatService } from "./chat.service";
import axios from 'axios';

@Component({
  selector: "app-chat",
  templateUrl: "./chat.component.html",
  styleUrls: ["./chat.component.css"]
})
export class ChatComponent {
  newMessage: string;
  messageList:  string[] = [];

  constructor(public router: Router, private chatService: ChatService) {}

  sendMessage() {
    this.chatService.sendMessage(this.newMessage);
    this.newMessage = '';
  }
  
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
    this.chatService
      .getMessages()
      .subscribe((message: string) => {
        this.messageList.push(message);
      });
  }
}