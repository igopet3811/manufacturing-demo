import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatSortable } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ToastrService } from 'ngx-toastr';

import { LoaderService } from '../../../../shared/services/loader.service';

import { ProductList } from '../../../../shared/data/product-list.data';
import { LineDescription } from '../../../../shared/data/line-description.data';
import { YieldsService } from '../../services/yield.service';

@Component({
    selector: 'app-yields-table',
    templateUrl: './yields-table.component.html',
    styleUrls: ['./yields-table.component.scss'],
    animations: [
      trigger('detailExpand', [
        state('void', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
        state('*', style({ height: '*', visibility: 'visible' })),
        transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      ]),
    ],
})
export class YieldsTableComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  public displayedColumns: string[] = ['sampleTable', 'order', 'batch', 'cfn', 'geo', 'producedAt', 'line', 'type', 'shift', 'total', 'accepted', 'yield'];
  public expandedColumns: string[] = ['shift', 'produced', 'sampled', 'sampledFromProduced', 'sampledFromTotal'];

  public sortedData;
  public rowData = [];
  public request = {
    years: [2019],
    geographies: ['EU', 'OEU'],
    cfns: []
  };
  public productList = ProductList;
  public lineDesc = LineDescription;
  public icon;

  constructor(
    private yieldsService: YieldsService,
    private loaderService: LoaderService,
    private toastr: ToastrService
  ){
    this.loaderService.display(true);
  }

  ngOnInit() {
    this.yieldsService.getYieldsData().subscribe(
      success => {
        this.retrieveYields(success);
      },
      err => {
        this.toastr.error('Error fetching data.', 'Server Error', {
          positionClass: 'toast-bottom-right',
        });
        this.loaderService.display(false);
      }
    )
  }

  retrieveYields(data) {
    this.sortedData = new MatTableDataSource(data.slice().map(item => Object.assign({}, item, {
      yield: item['accepted']/item['total'],
      batch: this.padBatchNumber(item.batch),
      lineDescription: this.getLineDesc(item),
      lineType: this.getLineType(item)
    })));

    this.sortedData.sortData = (data, sort: MatSort) => {
      if (!sort.active || sort.direction === '') {
        return data;
      }

      return data = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'order': return compare(a.order, b.order, isAsc);
          case 'batch': return compare(a.batch, b.batch, isAsc);
          case 'cfn': return compare(a.cfn, b.cfn, isAsc);
          case 'producedAt': return compare(a.producedAt, b.producedAt, isAsc);
          case 'line': return compare(a.line, b.line, isAsc);
          case 'type': return compare(a.type, b.type, isAsc);
          case 'total': return compare(a.total, b.total, isAsc);
          case 'accepted': return compare(a.accepted, b.accepted, isAsc);
          case 'yield': return compare((a.accepted/a.total)*100, (b.accepted/b.total)*100, isAsc);
          default: return 0;
        }
      });
    };
    
    this.sort.sort(<MatSortable>({id: 'producedAt', start: 'desc'}));
    this.sortedData.sort = this.sort;
    this.sortedData.paginator = this.paginator;
    this.loaderService.display(false);
  }

  padBatchNumber(b: string){
    return b.padStart(10,'0');
  }

  applyFilter(filterValue: string) {
    this.sortedData.filter = filterValue.trim().toLowerCase();

    if (this.sortedData.paginator) {
      this.sortedData.paginator.firstPage();
    }
  }

  filterSubmitted(evt) {
    this.toastr.error('This feature is not available in demo version.', 'DEMO', {
      positionClass: 'toast-bottom-right',
    });
  }

  getGeography(product) {
    let prod = this.productList.filter(p => p.cfn === product.cfn);
    return prod[0].geo;
  }

  getLineDesc(po) {
    return this.lineDesc.filter(p => p.line.toLowerCase() === po.line.toLowerCase())[0].description;
  }

  getLineType(po) {
    return this.lineDesc.filter(p => p.line.toLowerCase() === po.line.toLowerCase())[0].type;
  }

  getTotalProduced(row) {
    return row.map(t => t.produced).reduce((acc, value) => acc + value, 0);
  }

  getTotalSampled(row) {
    return row.map(t => t.sampled).reduce((acc, value) => acc + value, 0);
  }
}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}