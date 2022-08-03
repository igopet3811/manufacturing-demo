import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { getYearsFilter } from '../../../../../shared/data/date-helpers';
import { getCells } from '../../../../../shared/data/line-description.data';
import { getCurrentWeekNumber } from '../../../../../shared/data/date-helpers';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-weekly-throughput-filter',
  templateUrl: './weekly-throughput-filter.component.html',
  styleUrls: ['./weekly-throughput-filter.component.scss']
})
export class WeeklyThroughputFilterComponent implements OnInit {

  @Output() filter = new EventEmitter();

  weekFilter: FormGroup;

  public yearSelect = getYearsFilter(2019);
  public weekSelect = Array.from(Array(52), (x,i) => i + 1);
  public lineSelect = getCells().filter(line => line.active === true).sort((a,b) => (a.description > b.description) ? 1 : ((b.description > a.description) ? -1 : 0));

  constructor(private fb: FormBuilder,
    private toastr: ToastrService) { }

  ngOnInit() {
    this.weekFilter = this.fb.group({
      weekSelect: new FormControl(getCurrentWeekNumber()),
      yearSelect: new FormControl(new Date().getFullYear()),
      lineSelect: new FormControl('Resource_1')
    });
  }

  onFilterSubmit() {
    this.toastr.error('This feature is not available in demo version.', 'DEMO', {
      positionClass: 'toast-bottom-right',
    });
  }
}
