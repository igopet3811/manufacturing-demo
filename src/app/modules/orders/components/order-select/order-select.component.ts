import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-order-select',
  templateUrl: './order-select.component.html',
  styleUrls: ['./order-select.component.scss']
})
export class OrderSelectComponent implements OnInit {

  @Output() po = new EventEmitter();
  searchForm: FormGroup;
  poValue: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.searchForm = new FormGroup({
      po: new FormControl('', [Validators.required])
    });

  }

  onSubmit() {
    if (this.searchForm.valid){
      this.po.emit(this.searchForm.controls.po.value);
    }
  }
}
