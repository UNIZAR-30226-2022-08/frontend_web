import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { HomeComponent } from "./home/home.component";
import { TableroComponent } from "./tablerov1/tablero.component";


const appRoutes = [
    { path: '', component: AppComponent, pathMatch: "full"},
    { path: 'register', component: RegisterComponent, pathMatch: "full"},
    { path: 'login', component: LoginComponent, pathMatch: "full"},
    { path: 'home', component: HomeComponent, pathMatch: "full"},
    { path: 'tablero', component: TableroComponent, pathMatch: "full"}
];
export const routing = RouterModule.forRoot(appRoutes);