import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { BehaviorSubject, Observable } from 'rxjs';
import { ClientConfiguration } from '../classes/classes';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  
  private clientConfig:ClientConfiguration;
  private defaultClientConfig: ClientConfiguration;

  private clientConfigSubject: BehaviorSubject<ClientConfiguration>;
  public clientConfig$: Observable<ClientConfiguration>;

  constructor() {
    this.defaultClientConfig = new ClientConfiguration(
      environment.serverUrl,
      '/headers',
      '/seed_sql',
      '/config',
      '/query');
    this.clientConfig = { ...this.defaultClientConfig };
    
    this.clientConfigSubject = new BehaviorSubject<ClientConfiguration>(this.clientConfig);
    this.clientConfig$ = this.clientConfigSubject.asObservable();
  }
  
  updateClientConfig(newConfig: ClientConfiguration) {
    this.clientConfig = { ...newConfig };
    this.clientConfigSubject.next(newConfig);
    console.log('New config.',this.clientConfig);
  }

  resetClientConfig() {
    this.updateClientConfig(this.defaultClientConfig);
  }
  
}
