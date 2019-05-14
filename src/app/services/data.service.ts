import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { BehaviorSubject, timer, of, Observable, pipe, interval, OperatorFunction, Subscription } from 'rxjs';
import { takeUntil, switchMap, take, retryWhen, finalize } from 'rxjs/operators';
import { checkAndUpdateBinding } from '@angular/core/src/view/util';
import { DataSource } from '@angular/cdk/table';
import { ConfigurationService } from './configuration.service';
import { ClientConfiguration } from '../classes/classes';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // boolean to watch for connection established
  private connectionSubject = new BehaviorSubject<boolean>(false);
  public connection$ = this.connectionSubject.asObservable();

  // api Details returned from request to serverUrl/api
  private apiDetailsSubject = new BehaviorSubject<Array<any>>([]);
  private apiDetails$ = this.apiDetailsSubject.asObservable();

  // Full table data from SELECT * FROM {tablename} (WARNING! should be presented paginated, may be too big handle in the DOM)
  private dataSubject = new BehaviorSubject<Array<any>>([]);
  public data$ = this.dataSubject.asObservable();

  private tryConnection$: Observable<any>;

  private loadData$: Observable<Array<any>>;

  private sendQuery$: Observable<Array<any>>;
  private queryResultSubject = new BehaviorSubject<Array<any>>([]);
  private queryResult$ = this.queryResultSubject.asObservable();

  http_retry<T>(retries: number, delay: number): OperatorFunction<T, T> {
    return (src: Observable<T>): Observable<T> => {
      return src.pipe(
        retryWhen(err => {
          return interval(delay)
            .pipe(
              take(retries)
            );
        }));
    };
  }

  client_config: ClientConfiguration;
  client_configSubscription: Subscription;

  constructor(private http: HttpClient, private cs: ConfigurationService) {
    this.client_configSubscription = cs.config$.subscribe(config => this.client_config = config);
    this.tryConnection$ = http.get(this.client_config.serverUrl)
      .pipe(
        this.http_retry(10, 1000),
      )
  }



  loadData() {
    if (!false)
      return;
    this.http.post(environment.serverUrl + 'api/query', { query: "SELECT * FROM base" })
      .subscribe(json_data => {
        this.dataSubject.next([json_data]);
        console.log(json_data);
      })
  }

  checkConnection() {
    console.log('testing connection...');
    this.http.get(environment.serverUrl)
      .subscribe(result => {
        // this.apiDetails = result;
        console.log('Success connecting to the server!', result);
        this.connectionSubject.next(true);
        this.loadData();
      },
        err => {
          console.error('There has been an error while reaching the server', err);
        }, () => console.log('GET completed'));
  }

}
