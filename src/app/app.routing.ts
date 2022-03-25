import { RouterModule, Routes } from "@angular/router";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";

const appRoutes = [
    { path: '', component: AppComponent, pathMatch: "full"},
    { path: 'register', component: RegisterComponent, pathMatch: "full"},
    { path: 'login', component: LoginComponent, pathMatch: "full"}
];
export const routing = RouterModule.forRoot(appRoutes);