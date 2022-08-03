import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'user-dialog',
    templateUrl: './user-dialog.component.html',
    styleUrls: ['./user-dialog.component.scss']
})
export class UserDialogComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(6)]],
      password1: ['', [Validators.required, Validators.minLength(6)]],
      password2: ['', [Validators.required, Validators.minLength(6)]],
      isAdmin: [false, []]
    });

  }

  save() {
    if(this.form.valid && this.form.value.password1 === this.form.value.password2) {
      this.toastr.error('This feature is not available in demo version.', 'DEMO', {
        positionClass: 'toast-bottom-right',
      });
    }
  }

  close() {
    this.dialogRef.close();
  }

  isFormValid() {
    return this.form.valid && (this.form.value.password1 === this.form.value.password2);
  }
}