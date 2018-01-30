import { Component, OnInit } from '@angular/core';
import { environment } from 'environments/environment';

declare const moment: any;

@Component({
  selector: 'app-footer',
  templateUrl: './app.footer.component.html'
})
export class AppFooterComponent implements OnInit {
  public appVersion;
  public appYear;

  constructor() {
    this.appVersion = environment.version;
    this.appYear = moment().year();
  }
  
  ngOnInit() { }
}
