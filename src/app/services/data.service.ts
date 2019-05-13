import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { BehaviorSubject, timer, of } from 'rxjs';
import { takeUntil, switchMap, take } from 'rxjs/operators';
import { checkAndUpdateBinding } from '@angular/core/src/view/util';
import { DataSource } from '@angular/cdk/table';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private subject = new BehaviorSubject<boolean>(false);
  public conectionestablished$ = this.subject.asObservable();
  private full_data:any;
  private apiDetails: any;


  private dataSubject = new BehaviorSubject<any>(this.full_data);
  public data$ = this.dataSubject.asObservable();

  constructor(private http: HttpClient) {
    this.check();
  }

  reloadData() {
    if (!this.apiDetails)
      return;
    this.http.post(environment.serverUrl + 'api/query', { query: "SELECT * FROM base" })
      .subscribe(json_data => {
        this.full_data = json_data;
        this.dataSubject.next(this.full_data);
        console.log(json_data);
      })
  }

  check() {
    console.log('testing connection');
    this.http.get(environment.serverUrl)
      .pipe(take(1))
      .subscribe(result => {
        console.log('Success!', result);
        this.apiDetails = result;
        this.subject.next(true);
        this.reloadData();
      },
        err => {
          //this.conectionEstablisedSource.next(false);
          console.error('There has been an error while reaching the server', err);
        }, () => console.log('GET completed'));
  }

  ApiDetails(): any {
    if (this.apiDetails) {
      return this.apiDetails;
    }
  }

}
