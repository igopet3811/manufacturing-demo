import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { MeService } from '../services/me.service';

@Component({
  selector: 'app-me-overview',
  templateUrl: './me-overview.html',
  styles: [`
  .yields-tab-icon {
    margin-right: 8px;
  }
`]
})

export class MeOverviewComponent implements OnInit {
  
  lastUnitTime: Date;

  constructor(
    private meService: MeService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.meService.getLastTimestamp().subscribe(
      success => {
        this.lastUnitTime = success;
      },
      err => {
        this.toastr.error('Unable to retrieve resource_1 last unit timestamp.', 'Server Error', {
          positionClass: 'toast-bottom-right',
        });
      }
    )
  }
}
