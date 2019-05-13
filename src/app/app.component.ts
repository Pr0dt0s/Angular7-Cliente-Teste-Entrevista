import { Component } from '@angular/core';
import { MAT_DRAWER_DEFAULT_AUTOSIZE } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'NodeJs-Client';
  constructor() {

  }

  eventfired() {
    console.log('recieved');
  }
}
