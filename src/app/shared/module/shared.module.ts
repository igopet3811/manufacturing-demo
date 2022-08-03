import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* services */
import { LoaderService } from '../services/loader.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    LoaderService,
  ]
})
export class SharedModule {}
