import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { BehaviorSubject, Observable } from 'rxjs';
import { ClientConfiguration } from '../classes/classes';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  
  private config:ClientConfiguration;
  private defaultConfig: ClientConfiguration;

  private configSubject: BehaviorSubject<ClientConfiguration>;
  public config$: Observable<ClientConfiguration>;

  constructor() {
    this.defaultConfig = new ClientConfiguration(
      environment.serverUrl,
      '/headers',
      '/seed_sql',
      '/config',
      '/query');
    this.config = this.defaultConfig;
    
    this.configSubject = new BehaviorSubject<ClientConfiguration>(this.config);
    this.config$ = this.configSubject.asObservable();
  }
  
  updateConfig(newConfig: ClientConfiguration) {
    this.config = { ...newConfig };
    this.configSubject.next(newConfig);
    console.log('New config.',this.config);
  }

  resetConfig() {
    this.updateConfig(this.defaultConfig);
  }
  
}
