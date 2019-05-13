import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { BehaviorSubject, timer, of } from 'rxjs';
import { takeUntil, switchMap } from 'rxjs/operators';
import { checkAndUpdateBinding } from '@angular/core/src/view/util';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private conectionEstablisedSource = new BehaviorSubject<Boolean>(false);
  public conectionestablished$ = this.conectionEstablisedSource.asObservable();

  private full_data = [];

  private dataSource = new BehaviorSubject(this.full_data);
  public data$ = this.dataSource.asObservable();


  constructor(private http: HttpClient) {
    this.full_data = [];
    //this.check();
  }

  check() {
    this.http.get(environment.serverUrl)
      .subscribe(result => this.conectionEstablisedSource.next(!!result),
        err => {
          this.conectionEstablisedSource.next(false)
          console.error('There has been an error while reaching the server',err)
        }, () => console.log('GET completed'));
  }

}
