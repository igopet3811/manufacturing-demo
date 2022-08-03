import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from './modules/auth/services/token-storage.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    public authService: TokenStorageService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {

    if (this.authService.getToken() === 'demo_token') {
      this.router.navigateByUrl('/yields');
    } else {
      this.authService.logout();
    }
  }

  alertMessage() {
    this.toastr.error('This feature is not available in demo version.', 'DEMO', {
      positionClass: 'toast-bottom-right',
    });
  }
}
