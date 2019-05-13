import { Component, OnInit, NgZone } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ResourceLoader } from '@angular/compiler';

import * as $ from 'jquery';

import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";



@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.sass']
})
export class DataComponent implements OnInit {

  data: any;

  subscription: Subscription;


  fields = [];

  selected_field1: string;
  selected_field2: string;

  constructor(private ds: DataService, private zone: NgZone) {
    am4core.useTheme(am4themes_animated);
  }



  reload() {
    console.log('Trying to load data...')
    this.subscription = this.ds.data$.subscribe(json_data => {
      console.log(json_data);

      this.data = json_data;
      this.fields = [];
      if (!json_data || !json_data.length || !(json_data.length > 0)) {
        return;
      }
      for (const key in this.data[0]) {
        if (this.data[0].hasOwnProperty(key)) {
          this.fields.push(key);
        }
      }
      console.log(this.fields);
      setTimeout(() => this.createChart(), 500);
    });
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.reload();
  }

  private chart: am4charts.XYChart;

  createChart() {
    return;
    if (!this.data || !this.data.length || !(this.data.length > 0)) {
      return;
    }
    let field1 = String($('#field1').val());
    let field2 = String($('#field2').val());

    if (field1 === field2) {
      // select defaults
      $('#field1').val('tipo');
      $('#field2').val('valor');
      field1 = 'tipo';
      field2 = 'valor';
    }

    //console.log(field1, field2);
    this.zone.runOutsideAngular(() => {

      if (this.chart) {
        console.log('cleaning the chart');
        this.chart.dispose();
      }
      let chart = am4core.create("chartdiv", am4charts.XYChart);

      chart.paddingRight = 20;
      let i = 0;
      chart.data = this.data.map((row) => {
        let obj = {};
        obj[field1] = row[field1] ? row[field1] : 0;
        obj[field2] = row[field2] ? row[field2] : 0;
        if (obj['data']) {
          obj['data'] = new Date((obj['data'] - (25567 + 2)) * 86400 * 1000);
        }
        //console.log(obj);
        return obj;
      });
      //console.log(chart.data);
      let dateAxis = chart.xAxes.push(new am4charts.CategoryAxis());
      dateAxis.renderer.grid.template.location = 0;

      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.minWidth = 35;

      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.dateX = field1;
      series.dataFields.categoryY = field2;

      series.tooltipText = "{valueY.value}";
      chart.cursor = new am4charts.XYCursor();

      let scrollbarX = new am4charts.XYChartScrollbar();
      scrollbarX.series.push(series);
      chart.scrollbarX = scrollbarX;

      this.chart = chart;

    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
    this.subscription.unsubscribe();
  }

  ngOnInit() {
  }

}
