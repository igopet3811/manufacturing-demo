import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatSortable, MatDialog } from '@angular/material';

import { ToastrService } from 'ngx-toastr';
import { AdminService } from '../../services/admin.services';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { UserDialogEditComponent } from '../user-dialog-edit/user-dialog-edit.component';

@Component({
  selector: 'app-admin-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  private getUsers = this.adminService.getAllUsers();
  public sortedData;
  displayedColumns: string[] = ['id', 'email', 'username', 'role'];

  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.getUsers.subscribe(
      success => {
        let processedData = success;
        for(let user of processedData) {
          user['role'] = user.roles.map(r => r.name).includes('ROLE_ADMIN') ? 'Admin' : 'User';
        }
        this.sortedData = new MatTableDataSource(processedData);
        this.sortedData.sortData = (data, sort: MatSort) => {
          if (!sort.active || sort.direction === '') {
            return data;
          }

          return data = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
              case 'id': return compare(a.id, b.id, isAsc);
              case 'username': return compare(a.username, b.username, isAsc);
              case 'email': return compare(a.email, b.email, isAsc);
              case 'role': return compare(a.role, b.role, isAsc);
              default: return 0;
            }
          });
        };
        
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

  addUser(evt) {
    const dialogRef = this.dialog.open(UserDialogComponent, { height:'500px',width:'600px'});
    dialogRef.afterClosed().subscribe(data => {
      if(!!data) {
        const newUser = {username: data.username, email: data.email, password1: data.password1, password2: data.isAdmin};
      }
    });
  }

  editUser(row, evt) {
    const dialogRefU = this.dialog.open(UserDialogEditComponent, { height:'450px',width:'600px', data : { user: row } });
    dialogRefU.afterClosed().subscribe(data => {
      if(!!data) this.loadData();
    });
  }
}

function compare(a: number | string | Date, b: number | string | Date, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
