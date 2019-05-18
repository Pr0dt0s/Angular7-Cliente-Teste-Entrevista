import { Component, OnInit, NgZone } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Observable, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import * as $ from 'jquery';
import * as Chart from 'chart.js';

@Component({
  selector: 'app-data-page',
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.sass']
})
export class DataPageComponent implements OnInit {

  data = [];
  headers = [];

  // query: string = 'SELECT uuid,estado FROM base WHERE valor > 100 LIMIT 5';
  query: string = 'SELECT uf, sum(valor) from base group by uf';

  connected = false;
  conSub: Subscription;

  data$: Observable<any>;
  headers$: Observable<any>;
  chart;

  constructor(private ds: DataService) {
    this.conSub = this.ds.connection$.subscribe(con => this.connected = con);
    this.headers$ = this.ds.headers$;
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
  //table = document.createElement('div');


  transpose(a) {
    return Object.keys(a[0]).map(function (c) {
      return a.map(function (r) { return r[c]; });
    });
  }

  refresh(jdata) {
    //console.log(jdata[0]);
    if (!jdata || !jdata.length || !(jdata.length > 1)) {
      jdata = { msg: "no data recieved" };
      return;
    }
    this.headers = []
    for (let k in jdata[0]) {
      this.headers.push(k);
    }
    console.log(this.headers);
    this.data = jdata.map(row => {
      let newrow = this.headers.length === 1 ? row[this.headers[0]]: this.headers.map(h => row[h]);
      return newrow;
    });
    if (this.headers.length > 1) {
      // this.data = this.transpose(this.data);
    }
    let datasets = [];
    this.headers.forEach(h => {
      let new_dataset = {
        label: h,
        data: [],
        borderWidth: 1
      }
      datasets.push(new_dataset);
    });
    for (let i = 0; i < datasets.length; i++) {
      datasets[i].data = this.data.map(v => v.length?v[i]:v);
      console.log(datasets[i].data);
    }
    let labels = this.data.map((_, i) => String(i));
    console.log(JSON.parse(JSON.stringify(datasets)));
    
    this.chart = new Chart('datachart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
      }
    });
    // this.chart;
    console.log('drawing');
    // t.redraw();
  }

  ngOnDestroy(): void {
    this.conSub.unsubscribe();
  }

  ngOnInit() {

  }

}
