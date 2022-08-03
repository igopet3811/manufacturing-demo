import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatSortable, MatDialog } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../services/admin.services';

@Component({
  selector: 'app-admin-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  private getRoles = this.adminService.getAllRoles();
  public sortedData;
  displayedColumns: string[] = ['id', 'name'];

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.getRoles.subscribe(
      success => {
        this.sortedData = new MatTableDataSource(success);
        this.sortedData.sortData = (data, sort: MatSort) => {
          if (!sort.active || sort.direction === '') {
            return data;
          }

          return data = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
              case 'id': return compare(a.id, b.id, isAsc);
              case 'name': return compare(a.name, b.name, isAsc);
              default: return 0;
            }
          });
        };
        
        /* sort default by import time */
        this.sort.sort(<MatSortable>({id: 'id', start: 'desc'}));
        this.sortedData.sort = this.sort;
        this.sortedData.paginator = this.paginator;
      },
      err => {
        this.toastr.error('Error fetching users.', 'Server Error', {
          positionClass: 'toast-bottom-right',
        });
      }
    );
  }
}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}