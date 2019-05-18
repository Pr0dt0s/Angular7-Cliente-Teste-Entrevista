import { Component, OnInit, ViewChild, AfterViewInit, Injector, ApplicationRef, ComponentFactoryResolver, ViewContainerRef, ComponentFactory } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Observable, fromEvent, of, empty } from 'rxjs';
import * as Chart from 'chart.js';
import { switchMap } from 'rxjs/operators';
import { DataTableComponent } from 'src/app/components/data-table/data-table.component';

export interface DataTableMessage {
  datasets: Chart.ChartDataSets[],
  labels: string[]
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  lbs: (string | string[])[];
  opt: Chart.ChartOptions;
  dts$: Observable<Chart.ChartDataSets[]>;
  type: 'bar' | 'line' | 'doughnut' | 'pie' | 'bubbe' | 'radar' | 'polarArea' | 'scatter';
  @ViewChild('table1', { read: ViewContainerRef }) table1: ViewContainerRef;

  dtFactory: ComponentFactory<DataTableComponent>;
  constructor(private ds: DataService, private injector: Injector, private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef) {
    Chart.defaults.global.defaultFontFamily = 'Montserrat';
    Chart.defaults.global.title.display = true;
    Chart.defaults.global.legend.position = 'bottom';
    Chart.defaults.global.animation.animateRotate = true;
    Chart.defaults.global.animation.animateScale = true;
    Chart.defaults.global.animation.easing = 'easeInOutQuad';
    // this.appRef.attachView(cr.hostView);
    this.dtFactory = this.componentFactoryResolver.resolveComponentFactory(DataTableComponent);
  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.prepareTable1();
    this.prepareTable2();
    this.prepareTable3();
    this.prepareTable4();
    this.prepareTable5();
  }

  colors = [
    "rgba(255, 99, 132, 0.7)", "rgba(255, 159, 64, 0.7)", "rgba(255, 205, 86, 0.7)", "rgba(75, 192, 192, 0.7)", "rgba(54, 162, 235, 0.7)", "rgba(153, 102, 255, 0.7)", "rgba(201, 203, 207, 0.7)",
    "rgba(255, 99, 132, 0.7)", "rgba(255, 159, 64, 0.7)", "rgba(255, 205, 86, 0.7)", "rgba(75, 192, 192, 0.7)", "rgba(54, 162, 235, 0.7)", "rgba(153, 102, 255, 0.7)", "rgba(201, 203, 207, 0.7)",
    "rgba(255, 99, 132, 0.7)", "rgba(255, 159, 64, 0.7)", "rgba(255, 205, 86, 0.7)", "rgba(75, 192, 192, 0.7)", "rgba(54, 162, 235, 0.7)", "rgba(153, 102, 255, 0.7)", "rgba(201, 203, 207, 0.7)",
    "rgba(255, 99, 132, 0.7)", "rgba(255, 159, 64, 0.7)", "rgba(255, 205, 86, 0.7)", "rgba(75, 192, 192, 0.7)", "rgba(54, 162, 235, 0.7)", "rgba(153, 102, 255, 0.7)", "rgba(201, 203, 207, 0.7)",
    "rgba(255, 99, 132, 0.7)", "rgba(255, 159, 64, 0.7)", "rgba(255, 205, 86, 0.7)", "rgba(75, 192, 192, 0.7)", "rgba(54, 162, 235, 0.7)", "rgba(153, 102, 255, 0.7)", "rgba(201, 203, 207, 0.7)",
    "rgba(255, 99, 132, 0.7)", "rgba(255, 159, 64, 0.7)", "rgba(255, 205, 86, 0.7)", "rgba(75, 192, 192, 0.7)", "rgba(54, 162, 235, 0.7)", "rgba(153, 102, 255, 0.7)", "rgba(201, 203, 207, 0.7)",
    "rgba(255, 99, 132, 0.7)", "rgba(255, 159, 64, 0.7)", "rgba(255, 205, 86, 0.7)", "rgba(75, 192, 192, 0.7)", "rgba(54, 162, 235, 0.7)", "rgba(153, 102, 255, 0.7)", "rgba(201, 203, 207, 0.7)",
    "rgba(255, 99, 132, 0.7)", "rgba(255, 159, 64, 0.7)", "rgba(255, 205, 86, 0.7)", "rgba(75, 192, 192, 0.7)", "rgba(54, 162, 235, 0.7)", "rgba(153, 102, 255, 0.7)", "rgba(201, 203, 207, 0.7)",
    "rgba(255, 99, 132, 0.7)", "rgba(255, 159, 64, 0.7)", "rgba(255, 205, 86, 0.7)", "rgba(75, 192, 192, 0.7)", "rgba(54, 162, 235, 0.7)", "rgba(153, 102, 255, 0.7)", "rgba(201, 203, 207, 0.7)",
    "rgba(255, 99, 132, 0.7)", "rgba(255, 159, 64, 0.7)", "rgba(255, 205, 86, 0.7)", "rgba(75, 192, 192, 0.7)", "rgba(54, 162, 235, 0.7)", "rgba(153, 102, 255, 0.7)", "rgba(201, 203, 207, 0.2)"];

  prepareTable1() {
    let masterkey = 'uf';
    let keys = ['sum(alo)', 'sum(cpc)', 'sum(cpca)', 'sum(pp)'];
    let labels = ['ALO', 'CPC', 'CPCA', 'PP'];
    let type: 'bar' | 'line' | 'doughnut' | 'pie' | 'bubbe' | 'radar' | 'polarArea' | 'scatter' = 'bar';

    //const factory = this.componentFactoryResolver.resolveComponentFactory(DataTableComponent);
    const cref = this.table1.createComponent(this.dtFactory);
    cref.instance.width = '150px';
    cref.instance.height = '100px';
    cref.instance.type = type;
    cref.instance.options = {
      title: { text: 'Produtividade por estado'.toUpperCase() },
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true
        }]
      },
      responsive: true,
    };
    cref.instance.datasets$ = this.getdatasetObservable(masterkey, keys, labels);
    cref.instance.labels = labels;
    cref.instance.reload();
    cref.changeDetectorRef.detectChanges();
    console.log(cref.instance);
  }

  prepareTable2() {
    let masterkey = 'dia';
    let keys = ['sum(alo)', 'sum(cpc)', 'sum(cpca)', 'sum(pp)'];
    let labels = ['ALO', 'CPC', 'CPCA', 'PP'];
    let type: 'bar' | 'line' | 'doughnut' | 'pie' | 'bubbe' | 'radar' | 'polarArea' | 'scatter' = 'line';

    const cref = this.table1.createComponent(this.dtFactory);
    cref.instance.width = '150px';
    cref.instance.height = '100px';
    cref.instance.type = type;
    cref.instance.options = {
      title: { text: 'Produtividade por dia'.toUpperCase() },
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true
        }]
      },
      responsive: true,
    };
    cref.instance.datasets$ = this.getdatasetObservable(masterkey, keys, labels);
    cref.instance.labels = labels;
    cref.instance.reload();
    cref.changeDetectorRef.detectChanges();
    console.log(cref.instance);
  }

  prepareTable3() {
    let masterkey = 'uf';
    let keys = ['sum(valor)'];
    let labels = ['Valor'];
    let type: 'bar' | 'line' | 'doughnut' | 'pie' | 'bubbe' | 'radar' | 'polarArea' | 'scatter' = 'bar';

    const cref = this.table1.createComponent(this.dtFactory);
    cref.instance.width = '150px';
    cref.instance.height = '100px';
    cref.instance.type = type;
    cref.instance.options = {
      title: { text: 'Valor por estado'.toUpperCase() },
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true
        }]
      },
      responsive: true,
    };
    cref.instance.datasets$ = this.getdatasetObservable(masterkey, keys, labels);
    cref.instance.labels = labels;
    cref.instance.reload();
    cref.changeDetectorRef.detectChanges();
    console.log(cref.instance);
  }

  prepareTable4() {
    let masterkey = 'produto';
    let keys = ['sum(valor)'];
    let labels = ['Valor'];
    let type: 'bar' | 'line' | 'doughnut' | 'pie' | 'bubbe' | 'radar' | 'polarArea' | 'scatter' = 'polarArea';

    const cref = this.table1.createComponent(this.dtFactory);
    cref.instance.width = '150px';
    cref.instance.height = '100px';
    cref.instance.type = type;
    cref.instance.options = {
      title: { text: 'Valor por tipo'.toUpperCase() },
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true
        }]
      },
      responsive: true,
    };
    cref.instance.datasets$ = this.getdatasetObservable(masterkey, keys, labels);
    cref.instance.labels = labels;
    cref.instance.reload();
    cref.changeDetectorRef.detectChanges();
    console.log(cref.instance);
  }

  prepareTable5() {
    let masterkey = 'uf';
    let keys = ['sum(fraude)','sum(processo_Juridico)'];
    let labels = ['Fraude','Processo Juridico'];
    let type: 'bar' | 'line' | 'doughnut' | 'pie' | 'bubbe' | 'radar' | 'polarArea' | 'scatter' = 'bar';

    const cref = this.table1.createComponent(this.dtFactory);
    cref.instance.width = '150px';
    cref.instance.height = '100px';
    cref.instance.type = type;
    cref.instance.options = {
      title: { text: 'Problemas'.toUpperCase() },
      scales: {
        xAxes: [{
          stacked: true
        }],
        yAxes: [{
          stacked: true
        }]
      },
      responsive: true,
    };
    cref.instance.datasets$ = this.getdatasetObservable(masterkey, keys, labels);
    cref.instance.labels = labels;
    cref.instance.reload();
    cref.changeDetectorRef.detectChanges();
    console.log(cref.instance);
  }

  getdatasetObservable(masterkey: string, keys: string[], labels: string[]): Observable<DataTableMessage> {
    return this.ds.dataQuery(`select ${masterkey} , ${keys.join(',')} from base group by ${masterkey} order by ${masterkey}`)
      .pipe(
        switchMap(jdata => {
          console.log(jdata.length);
          let lbs = jdata.map(obj => obj[masterkey]);
          let index = 0;
          let datasets: Chart.ChartDataSets[] = keys.map((k, i) => {
            let dataset: Chart.ChartDataSets = {
              data: jdata.map(obj => obj[k]),
              backgroundColor: this.colors[i],
              borderColor: this.colors[i],
              borderWidth: 2,
              label: labels[i],
            };
            if (keys.length === 1) {
              dataset.backgroundColor = jdata.map((j, i) => this.colors[i]);
            }
            console.log(this.colors[i], this.colors[index])
            return dataset;
          });
          console.log(datasets);
          //let datasets: Chart.ChartDataSets[] = [{ data: [1, 2, 3, 4] }];
          const out: DataTableMessage = { datasets: datasets, labels: lbs };
          return of(out);
        }),
      );
  }
}
