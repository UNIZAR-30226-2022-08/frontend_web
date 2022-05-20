import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(private socket: Socket) { }

  public sendMessage(message: string) {
    this.socket.emit('new-message', message);
  }

  public getMessages = () => {
    return new Observable((observer: Observer<string>) => {
      this.socket.on('new-message', (message: string) => {
        observer.next(message);
      });
    })
  }
}