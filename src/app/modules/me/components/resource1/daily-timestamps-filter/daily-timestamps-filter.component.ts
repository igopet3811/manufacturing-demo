import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { getCells } from '../../../../../shared/data/line-description.data';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-daily-timestamps-filter',
  templateUrl: './daily-timestamps-filter.component.html',
  styleUrls: ['./daily-timestamps-filter.component.scss']
})
export class DailyTimestampsFilterComponent implements OnInit {

  @Output() filterDaily = new EventEmitter();

  timestampFilter: FormGroup;

  public today = new Date();
  public dateSelect = new Date();
  public lineSelect = getCells().filter(line => line.active === true).sort((a,b) => (a.description > b.description) ? 1 : ((b.description > a.description) ? -1 : 0));
  public shiftSelect = ['day', 'evening', 'night', 'weekend'];

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.timestampFilter = this.fb.group({
      dateSelect: new FormControl(new Date()),
      lineSelect: new FormControl('Resource_1'),
      shiftSelect: new FormControl('day')
    });
  }

  onFilterSubmit() {
    this.toastr.error('This feature is not available in demo version.', 'DEMO', {
      positionClass: 'toast-bottom-right',
    });
  }
}