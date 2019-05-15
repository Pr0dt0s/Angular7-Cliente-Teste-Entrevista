import { Injectable, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { BehaviorSubject, timer, of, Observable, pipe, interval, OperatorFunction, Subscription, config } from 'rxjs';
import { takeUntil, switchMap, take, retryWhen, finalize, tap } from 'rxjs/operators';
import { checkAndUpdateBinding } from '@angular/core/src/view/util';
import { DataSource } from '@angular/cdk/table';
import { ConfigurationService } from './configuration.service';
import { ClientConfiguration, ServerConfiguration } from '../classes/classes';

@Injectable({
  providedIn: 'root'
})
export class DataService implements OnInit{

  // boolean to watch for connection established
  private connectionSubject = new BehaviorSubject<boolean>(false);
  public connection$ = this.connectionSubject.asObservable();

  // api Details returned from request to serverUrl/api
  private apiDetailsSubject = new BehaviorSubject<Array<any>>([]);
  public apiDetails$ = this.apiDetailsSubject.asObservable();

  // Full table data from SELECT * FROM {tablename} (WARNING! should be presented paginated, may be too big handle in the DOM)
  private dataSubject = new BehaviorSubject<Array<any>>([]);
  public data$ = this.dataSubject.asObservable();

  private tryConnection$: Observable<any>;

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

  clientConfig: ClientConfiguration;
  clientConfigSubscription: Subscription;

  private serverConfigSubject = new BehaviorSubject<ServerConfiguration>(new ServerConfiguration(
    'localhost','3000','test_user','P@ssw0rd','test_db','base',false,false
  ));
  public serverConfig$ = this.serverConfigSubject.asObservable();

  constructor(private http: HttpClient, private cs: ConfigurationService) {
    this.clientConfigSubscription = cs.clientConfig$.subscribe(config => this.clientConfig = config);
    this.tryConnection$ = http.get(this.clientConfig.serverUrl)
      .pipe(
        this.http_retry(10, 1000),
    );
    this.checkConnection();
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  queryConfig(newconfig?: ServerConfiguration): Observable<any> {
    // console.log('GET config');
    if (newconfig) {
      return this.http.post(this.clientConfig.serverUrl + this.clientConfig.configUrl, { newconfig }).pipe(tap(config => this.serverConfigSubject.next(config)));
    }
    return this.http.get(this.clientConfig.serverUrl + this.clientConfig.configUrl);
  }

  dataQuery(query: string): Observable<any> {
    return this.http.post(this.clientConfig.serverUrl + this.clientConfig.queryUrl, { query: query });
  }

  reseed() {
    this.http.get(this.clientConfig.serverUrl + this.clientConfig.reseedUrl).subscribe();
  }

  loadAllData() {
    this.dataQuery("SELECT * FROM base")
      .subscribe(json_data => {
        this.dataSubject.next(json_data);
        //console.log(json_data);
      }, err => {
          console.error("something went wrong with the conection", err);
          this.connectionSubject.next(false);
          this.checkConnection();
      });
  }

  private headersSubject = new BehaviorSubject<any>([]);
  public headers$ = this.headersSubject.asObservable();

  queryHeaders() {
    this.http.get(this.clientConfig.serverUrl + this.clientConfig.headersUrl).subscribe((h:Array<any>) => {
      this.headersSubject.next(h.map(v => ' '+v['COLUMN_NAME']).join(','));
    });
  }

  checkConnection() {
    console.log('testing connection...');
    this.tryConnection$.subscribe(results => {
      this.connectionSubject.next(true);
      this.apiDetailsSubject.next(results);
      this.queryConfig().subscribe(sconfig => this.serverConfigSubject.next(sconfig));
      this.queryHeaders();
    });
  }

}
