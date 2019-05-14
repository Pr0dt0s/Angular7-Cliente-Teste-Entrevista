import { Component, OnChanges, Input, SimpleChanges } from '@angular/core';
import Tabulator from 'tabulator-tables';

@Component({
  selector: 'app-tabulator',
  templateUrl: './tabulator.component.html',
  styleUrls: ['./tabulator.component.sass']
})
export class TabulatorComponent implements OnChanges {

  @Input() tableData: any[] = [];
  @Input() columnNames: any[] = [];
  @Input() height: string = '311px';

  tab = document.createElement('div');

  constructor() { }

  ngOnChanges(changes: SimpleChanges):void {
    this.drawTable();
  }

  private drawTable(): void {
    new Tabulator(this.tab, {
      data: this.tableData,
      reactiveData: true, //enable data reactivity
      columns: this.columnNames,
      layout: 'fitData',
      height: this.height
    });
    console.log('drawing');
    document.getElementById('my-tabular-table').appendChild(this.tab);
  }

}