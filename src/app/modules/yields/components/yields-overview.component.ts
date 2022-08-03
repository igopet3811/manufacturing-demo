import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-yields-overview',
  templateUrl: './yields-overview.html',
  styles: [`
    .yields-tab-icon {
      margin-right: 8px;
    }
  `]
})

export class YieldsOverviewComponent implements OnInit {

  constructor(
    private toastr: ToastrService
  ) { }

  ngOnInit() {

  }

  tabSelectionChanged(evt) {
    if(evt.index > 3) {
      this.toastr.error('This feature is not available in demo version.', 'DEMO', {
        positionClass: 'toast-bottom-right',
      });
    }
  }
}