import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { AdminService } from '../../../services/admin.services';
import { TokenStorageService } from '../../../../auth/services/token-storage.service';

@Component({
  selector:'app-user-profile-details',
  templateUrl: './user-profile-details.component.html',
  styleUrls: ['./user-profile-details.component.scss']
})
export class UserProfileDetailsComponent implements OnInit {

  userProfileForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private storageService: TokenStorageService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.userProfileForm = this.fb.group({
      id: [''],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(4)]],
      isAdmin: [{value: false, disabled: !this.storageService.isAdmin()}, [Validators.required, Validators.minLength(6)]]
    });
    this.loadData(this.storageService.getUsername());
  }

  loadData(username) {
    this.adminService.getUserProfile(username).subscribe(
      res => {
        this.userProfileForm.get('id').setValue(res['id']);
        this.userProfileForm.get('username').setValue(res['username']);
        this.userProfileForm.get('email').setValue(res['email']);
        this.userProfileForm.get('isAdmin').setValue(res['roles'].map(r => r.name).includes('ROLE_ADMIN'));
      },
      err => {
        this.toastr.error(`${err}`, 'EDIT PROFILE ERROR', {
          positionClass: 'toast-bottom-right',
        });
      }
    );
  }

  update() {
    if(this.userProfileForm.valid) {
      this.toastr.error('This feature is not available in demo version.', 'DEMO', {
        positionClass: 'toast-bottom-right',
      });
    }
  }
}
