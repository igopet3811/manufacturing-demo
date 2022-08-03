import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { AdminService } from '../../../services/admin.services';
import { TokenStorageService } from '../../../../auth/services/token-storage.service';

@Component({
  selector: 'app-user-profile-psw-change',
  templateUrl: './user-profile-psw-change.component.html',
  styleUrls: ['./user-profile-psw-change.component.scss']
})
export class UserProfilePswChangeComponent implements OnInit {

  pswChangeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private storageService: TokenStorageService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.toastr.error('This feature is not available in demo version.', 'DEMO', {
      positionClass: 'toast-bottom-right',
    });
    
    this.pswChangeForm = this.fb.group({
      id: [''],
      old: ['', [Validators.required, Validators.minLength(6)]],
      new1: ['', [Validators.required, Validators.minLength(6)]],
      new2: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.adminService.getUserProfile(this.storageService.getUsername()).subscribe(
      res => {
        this.pswChangeForm.get('id').setValue(res['id']);
      },
      err => {
        this.toastr.error(`${err}`, 'ERROR', {
          positionClass: 'toast-bottom-right',
        });
      }
    );
  }

  changePassword() {
    this.toastr.error('This feature is not available in demo version.', 'DEMO', {
      positionClass: 'toast-bottom-right',
    });
  }

}
