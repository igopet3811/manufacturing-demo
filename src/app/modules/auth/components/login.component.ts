import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TokenStorageService } from '../services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private tokenStorage: TokenStorageService
  ) { }

  ngOnInit() {

  }

  submit() {
    if (this.form.value.username === 'admin' && this.form.value.password === '123456') {
      this.router.navigateByUrl('/yields');
      this.tokenStorage.saveToken('demo_token');
      this.toastr.success('Successfully logged in as admin.', 'Success', {
        positionClass: 'toast-bottom-right',
      });
     } else {
      this.toastr.error('Invalid credentials', 'Error', {
        positionClass: 'toast-bottom-right',
      });
     }
  }
}
