import { Component } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'frontend_web';
  constructor(private router: Router) {
    axios.defaults.withCredentials = true;
    this.router.navigate(['home']);
  }
  
  goToPage(pageName:string){
    this.router.navigate([`${pageName}`]);
  }
}

