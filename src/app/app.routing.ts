import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { HomeComponent } from "./home/home.component";
import { TableroComponent } from "./tablerov1/tablero.component";
import { MainMenuComponent } from "./mainMenu/mainMenu.component";
import { ProfileComponent } from "./profile/profile.component";
import { FriendListComponent } from "./friendList/friendList.component";
import { ShopComponent } from "./shop/shop.component";
import { MatchListComponent } from "./matchList/matchList.component";

const appRoutes = [
    { path: '', component: AppComponent, pathMatch: "full"},
    { path: 'register', component: RegisterComponent, pathMatch: "full"},
    { path: 'login', component: LoginComponent, pathMatch: "full"},
    { path: 'home', component: HomeComponent, pathMatch: "full"},
    { path: 'tablero', component: TableroComponent, pathMatch: "full"},
    { path: 'mainMenu', component: MainMenuComponent, pathMatch: "full"},
    { path: 'profile', component: ProfileComponent, pathMatch: "full"},
    { path: 'friendList', component: FriendListComponent, pathMatch: "full"},
    { path: 'shop', component: ShopComponent, pathMatch: "full"},
    { path: 'matchList', component: MatchListComponent, pathMatch: "full"}
];
export const routing = RouterModule.forRoot(appRoutes);