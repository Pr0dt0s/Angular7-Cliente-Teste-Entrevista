import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import * as $ from 'jquery';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  @Output()
  onBurgerClicked = new EventEmitter();

  constructor() { }

  ngOnInit() {
    $('#burger').on('click', event => {
      this.onBurgerClicked.emit();
      console.log(event);
    });
  }

}
