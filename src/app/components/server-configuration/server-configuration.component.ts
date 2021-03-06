import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ServerConfiguration } from 'src/app/classes/classes';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Subscription, pipe, of } from 'rxjs';
import { tap, take, concatMap } from 'rxjs/operators';
import { FormGroup, NgForm } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-server-configuration',
  templateUrl: './server-configuration.component.html',
  styleUrls: ['./server-configuration.component.sass']
})
export class ServerConfigurationComponent implements OnInit, OnDestroy {

  @ViewChild('serverForm') form: NgForm;

  configModel: ServerConfiguration;

  configSubscription: Subscription;
  force = false;
  constructor(private ds: DataService) {

  }

  sendReseed() {
    this.ds.reseed();
  }

  sendConfig() {
    // this.cs.updateConfig(this.configModel);
    this.ds.queryConfig(this.configModel).subscribe();
  }

  ngOnInit() {
    this.configModel = {
      hostname: 'localhost',
      mysql_port: '3306',
      username: 'user_test',
      password: 'P@ssw0rd',
      database_name: 'test_db',
      table_name: 'base',
      replace_null: false,
      omit_null: false,
    }
    this.configSubscription = this.ds.serverConfig$
      .subscribe(config => {
        this.configModel = { ...config };
        console.log(config);
      });
  }

  ngOnDestroy() {
    this.configSubscription.unsubscribe();
  }

}
