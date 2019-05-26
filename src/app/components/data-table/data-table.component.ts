import { Component, OnInit, Input, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as Chart from 'chart.js';
import { Observable, Subscription } from 'rxjs';
import { DataTableMessage } from 'src/app/pages/dashboard/dashboard.component';

var nextId = 0;

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.sass']
})
export class DataTableComponent implements OnInit, AfterViewInit {

  @ViewChild('tableCanvas') tableCanvas: ElementRef;

  @Input() id = `dataTable-${nextId++}`;
  @Input() width = '150px';
  @Input() height = '100px';
  @Input() datasets$: Observable<DataTableMessage>;
  @Input() labels: (string | string[])[];
  @Input() options: Chart.ChartOptions;
  @Input() type: Chart.ChartType;

  @Input() darkbg: boolean = false;

  chart: Chart;
  subs: Subscription = new Subscription();
  context: CanvasRenderingContext2D;

  constructor() { }

  ngOnInit() {
  
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.context = (<HTMLCanvasElement>this.tableCanvas.nativeElement).getContext('2d');
    //this.reload();
  }

  reload() {
    console.log('loading...');
    if (this.subs && !this.subs.closed) {
      this.subs.unsubscribe();      
    }
    this.subs = this.datasets$.subscribe(dtm => {
      const datasets = [...dtm.datasets];
      this.labels = [...dtm.labels];
      if (this.chart) {
        this.chart.destroy();
      }
      
      this.chart = new Chart(this.context, {
        type: this.type,
        data: {
          labels: this.labels,
          datasets: datasets,
        },
        options: this.options,
      });
    })
  }
}
