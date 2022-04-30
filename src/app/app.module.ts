import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { FormsModule } from "@angular/forms";
import { routing } from './app.routing';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { TableroComponent } from './tablerov1/tablero.component';
import { MainMenuComponent } from './mainMenu/mainMenu.component';
import { ProfileComponent } from './profile/profile.component';
import { FriendListComponent } from './friendList/friendList.component';
import { MatchListComponent } from './matchList/matchList.component';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    TableroComponent,
    MainMenuComponent,
    ProfileComponent,
    FriendListComponent,
    MatchListComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    RouterModule
  ]
})
export class AppModule { }
