import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.sass']
})
export class HomePageComponent implements OnInit {

  serverConnected$: Observable<Boolean>;

  constructor(private ds:DataService) { }

  ngOnInit() {
    this.serverConnected$ = this.ds.conectionestablished$.pipe(tap(r => console.log(r)));
  }

}
