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
    this.chatService
      .getMessages()
      .subscribe((message: string) => {
        this.messageList.push(message);
      });
  }
}