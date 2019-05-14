import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ServerConfiguration } from 'src/app/classes/classes';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Subscription, pipe, of } from 'rxjs';
import { tap, take, concatMap } from 'rxjs/operators';
import { FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-server-configuration',
  templateUrl: './server-configuration.component.html',
  styleUrls: ['./server-configuration.component.sass']
})
export class ServerConfigurationComponent implements OnInit, OnDestroy {

  @ViewChild('configForm') form: NgForm;

  configModel: ServerConfiguration;

  configSubscription: Subscription;

  constructor(private cs: ConfigurationService) {

  }

  saveConfig() {
    // this.cs.updateConfig(this.configModel);
  }

  resetConfig() {
    this.cs.resetConfig();
  }

  ngOnInit() {
    this.configSubscription = this.cs.config$
      .subscribe(config => {
        // this.configModel = { ...config };
      });
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
  }

}
