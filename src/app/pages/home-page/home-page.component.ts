import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.sass']
})
export class HomePageComponent implements OnInit {

  serverConnected: boolean = false;
  data$: any;
  con_subs: Subscription;

  constructor(private ds: DataService) { }

  ngOnInit() {
    this.con_subs = this.ds.connection$.subscribe(v => this.serverConnected = v);
    this.data$ = this.ds.apiDetails$;
  }

  retry() {
    this.ds.checkConnection();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.con_subs.unsubscribe();
  }

}
