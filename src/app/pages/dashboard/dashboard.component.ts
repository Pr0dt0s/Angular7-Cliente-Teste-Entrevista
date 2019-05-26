import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ComponentFactoryResolver,
  ViewContainerRef,
  ComponentFactory,
  ComponentRef
} from "@angular/core";
import { DataService } from "src/app/services/data.service";
import { Observable, of } from "rxjs";
import * as Chart from "chart.js";
import { switchMap } from "rxjs/operators";
import { DataTableComponent } from "src/app/components/data-table/data-table.component";

export interface DataTableMessage {
  datasets: Chart.ChartDataSets[];
  labels: string[];
}

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.sass"]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild("tablesContainer", { read: ViewContainerRef })
  tablesContainer: ViewContainerRef;

  dtFactory: ComponentFactory<DataTableComponent>;

  class = "medium-grid";

  chartList: ComponentRef<DataTableComponent>[] = [];

  changeSize(cl: string): void {
    this.class = cl;
    this.chartList.forEach((chart: ComponentRef<DataTableComponent>) => {
      chart.instance.reload();
      chart.changeDetectorRef.detectChanges();
    });
  }

  darkColors = [
    "rgba(255, 99, 132, 0.7)",
    "rgba(163, 73, 164, 0.7)",
    "rgba(255, 255, 86, 0.7)",
    "rgba(75, 192, 192, 0.7)",
    "rgba(54, 162, 235, 0.7)",
    "rgba(153, 102, 255, 0.7)",
    "rgba(201, 203, 207, 0.7)"
  ];

  lightColors = [
    "rgba(200,25,15, 0.7)",
    "rgba(215,130,48, 0.7)",
    "rgba(215,255,25, 0.7)",
    "rgba(60,180,75, 0.7)",
    "rgba(0,130,200, 0.7)",
    "rgba(145,30,180, 0.7)",
    "rgba(70,240,240, 0.7)"
  ];

  colors = this.lightColors;
  colorText = "Dark Theme";

  toogleTheme() {
    if (this.colors === this.lightColors) {
      this.colors = this.darkColors;
      this.colorText = "Light Theme";
      Chart.defaults.global.defaultFontColor = "white";
    } else {
      this.colors = this.lightColors;
      this.colorText = "Dark Theme";
      Chart.defaults.global.defaultFontColor = "black";
    }
    this.tablesContainer.clear();
    this.chartList = [];
    this.prepareTables();
  }

  constructor(
    private ds: DataService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    Chart.defaults.global.defaultFontFamily = "Montserrat";
    Chart.defaults.global.title.display = true;
    Chart.defaults.global.legend.position = "bottom";
    Chart.defaults.global.animation.animateRotate = true;
    Chart.defaults.global.animation.animateScale = true;
    Chart.defaults.global.animation.easing = "easeInOutQuad";
    Chart.defaults.global.defaultFontColor = "black";
    Chart.defaults.global.responsive = true;
    Chart.defaults.global.layout.padding = {
      left: 4,
      right: 4
    };
    Chart.defaults.global.scales = {
      xAxes: [
        {
          stacked: true
        }
      ],
      yAxes: [
        {
          stacked: true
        }
      ]
    };
    // this.appRef.attachView(cr.hostView);
    this.dtFactory = this.componentFactoryResolver.resolveComponentFactory(
      DataTableComponent
    );
  }

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.prepareTables();
  }

  prepareTables() {
    // Table 1
    let masterkey = "uf";
    let keys = ["sum(alo)", "sum(cpc)", "sum(cpca)", "sum(pp)"];
    let labels = ["ALO", "CPC", "CPCA", "PP"];
    let type: Chart.ChartType = "bar";
    let options: Chart.ChartOptions = {
      title: { text: "Produtividade por estado".toUpperCase() }
    };
    this.createTable(type, masterkey, keys, labels, options);

    // Table 2
    masterkey = "dia";
    keys = ["sum(alo)", "sum(cpc)", "sum(cpca)", "sum(pp)"];
    labels = ["ALO", "CPC", "CPCA", "PP"];
    type = "line";
    options = {
      title: { text: "Produtividade por dia".toUpperCase() },
      scales: {
        yAxes: [
          {
            stacked: false
          }
        ]
      }
    };
    this.createTable(type, masterkey, keys, labels, options, undefined, true);

    // Table 3
    masterkey = "uf";
    keys = ["sum(valor)"];
    labels = ["Valor"];
    type = "bar";
    options = {
      title: { text: "Valor por estado".toUpperCase() }
    };
    this.createTable(type, masterkey, keys, labels, options);

    // Table 4
    masterkey = "produto";
    keys = ["sum(valor)"];
    labels = ["Valor"];
    type = "polarArea";
    options = {
      title: { text: "Valor por estado".toUpperCase() }
    };
    this.createTable(type, masterkey, keys, labels, options);

    // Table 5
    masterkey = "uf";
    keys = ["sum(fraude)", "sum(processo_Juridico)"];
    labels = ["Fraude", "Processo Juridico"];
    type = "horizontalBar";
    options = {
      title: { text: "Problemas por estado".toUpperCase() }
    };
    this.createTable(type, masterkey, keys, labels, options);
  }

  private createTable(
    type: Chart.ChartType,
    masterkey: string,
    keys: string[],
    labels: string[],
    options: Chart.ChartOptions = {},
    colors: string[] = this.colors,
    fill: boolean = false
  ) {
    let dark = this.colorText === "Light Theme";
    const cref = this.tablesContainer.createComponent(this.dtFactory);
    cref.instance.width = "120px";
    cref.instance.height = "80px";
    cref.instance.type = type;
    cref.instance.options = options;
    cref.instance.datasets$ = this.getdatasetObservable(
      masterkey,
      keys,
      labels,
      colors,
      fill
    );
    cref.instance.labels = labels;
    cref.instance.darkbg = dark;
    cref.instance.reload();
    cref.changeDetectorRef.detectChanges();
    this.chartList.push(cref);
  }

  getdatasetObservable(
    masterkey: string,
    keys: string[],
    labels: string[],
    colors: string[],
    fill: boolean
  ): Observable<DataTableMessage> {
    return this.ds
      .dataQuery(
        `select ${masterkey} , ${keys.join(
          ","
        )} from base group by ${masterkey} order by ${masterkey}`
      )
      .pipe(
        switchMap(jdata => {
          let lbs = jdata.map(obj => obj[masterkey]);
          let datasets: Chart.ChartDataSets[] = keys.map((k, i) => {
            let dataset: Chart.ChartDataSets = {
              data: jdata.map(obj => obj[k]),
              backgroundColor: colors[i % colors.length],
              borderColor: colors[i % colors.length],
              borderWidth: 2,
              label: labels[i],
              fill: fill ? (i === keys.length - 1 ? "origin" : "+1") : false
            };
            if (keys.length === 1) {
              dataset.backgroundColor = jdata.map(
                (j, i) => colors[i % colors.length]
              );
            }
            return dataset;
          });
          const out: DataTableMessage = {
            datasets: datasets,
            labels: lbs
          };
          return of(out);
        })
      );
  }
}
