import { Component, OnInit, NgZone } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Observable, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { ResourceLoader } from '@angular/compiler';
import Tabulator from 'tabulator-tables';

import * as $ from 'jquery';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { refreshDescendantViews } from '@angular/core/src/render3/instructions';



@Component({
  selector: 'app-data-page',
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.sass']
})
export class DataPageComponent implements OnInit {

  data=[];
  headers=[];

  query: string = 'SELECT * FROM base WHERE valor > 100 LIMIT 100';
  connected = false;
  conSub: Subscription;

  data$: Observable<any>;

  constructor(private ds: DataService) {
    this.conSub = this.ds.connection$
      .pipe(
        tap(con => {
          $("#querybtn").attr('disabled', String(!con))
        })
      ).subscribe(con => this.connected = con);
  }

  reload() {
    console.log('Trying to load data...')
  }

  ngAfterViewInit(): void {
    this.reload();
  }

  sendQuery() {
    this.data$ = this.ds.dataQuery(this.query)
      .pipe(
        tap(jdata => {
          if (jdata.length) {
            this.refresh(jdata);
          }
        })
      );
  }
  table = document.createElement('div');

  refresh(jdata) {
    //console.log(jdata[0]);
    this.headers = []
    for (let k in jdata[0]) {
      this.headers.push(k);
    }
    console.log(this.headers);
    this.data = jdata.map(row => {
      let newrow = this.headers.map(h => row[h]);
      return newrow;
    });
    new Tabulator(this.table, {
      data: this.data,
      reactiveData: true, //enable data reactivity
      columns: this.headers,
      layout: 'fitData',
      height: '500px'
    });
    console.log('drawing');
    document.getElementById('tabulator').appendChild(this.table);
  }

  ngOnDestroy(): void {
    this.conSub.unsubscribe();
  }

  ngOnInit() {
  }

}
