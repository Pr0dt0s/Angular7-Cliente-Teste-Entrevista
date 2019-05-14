import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ClientConfiguration } from 'src/app/classes/classes';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Subscription, pipe, of } from 'rxjs';
import { tap, take, concatMap } from 'rxjs/operators';
import { FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-client-configuration',
  templateUrl: './client-configuration.component.html',
  styleUrls: ['./client-configuration.component.sass']
})
export class ClientConfigurationComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('configForm') form: NgForm;

  configModel: ClientConfiguration;

  configSubscription: Subscription;

  constructor(private cs: ConfigurationService) {

  }

  saveConfig() {
    this.cs.updateConfig(this.configModel);
    // console.log(this.form);
    // this.form.form.setValue(this.configModel);
  }

  resetConfig() {
    this.cs.resetConfig();
  }

  ngAfterViewInit() {

  }

  ngOnInit() {
    this.configSubscription = this.cs.config$
      .subscribe(config => {
        this.configModel = { ...config };
      });
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
  }

}
