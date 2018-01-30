import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertComponent } from 'app/shared/alert/alert.component';
import { AppFooterComponent } from 'app/shared/footer/app.footer.component';
import { ConnectivityComponent } from 'app/shared/connectivity/connectivity.component';

@NgModule({
  imports: [CommonModule],
  declarations: [AlertComponent, AppFooterComponent, ConnectivityComponent],
  exports: [AlertComponent, AppFooterComponent, ConnectivityComponent]
})
export class SharedModule { }