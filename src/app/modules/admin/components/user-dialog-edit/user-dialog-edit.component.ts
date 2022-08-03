import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-dialog-edit',
  templateUrl: './user-dialog-edit.component.html',
  styleUrls: ['./user-dialog-edit.component.scss']
})
export class UserDialogEditComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      id: [this.data.user.id],
      email: [this.data.user.email, [Validators.required, Validators.email]],
      username: [this.data.user.username, [Validators.required, Validators.minLength(4)]],
      isAdmin: [this.data.user.role.toLowerCase() === 'user' ? false : true, []]
    });
  }

  update() {
    if(this.form.valid) {
      this.toastr.error('This feature is not available in demo version.', 'DEMO', {
        positionClass: 'toast-bottom-right',
      });
    }
  }

  resetPassword() {
    this.toastr.error('This feature is not available in demo version.', 'DEMO', {
      positionClass: 'toast-bottom-right',
    });
  }

  close() {
    this.dialogRef.close();
  }
}