import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { User } from 'app/modules/security/_model/user';
import { UserService } from 'app/services';
import { ShellService } from 'app/services/shell.service';

@Component({
  selector: 'app-header',
  templateUrl: './app.header.component.html'
})
export class AppHeaderComponent implements OnInit {
  currentUser: User;
  sidebarVisibility: boolean;
  sidebarVisibilitySubscription: Subscription;

  constructor(private userService: UserService, private shellService: ShellService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }

  ngOnInit() {
    this.sidebarVisibilitySubscription = this.shellService.sidebarVisibility.subscribe(visibility => this.sidebarVisibility = visibility);
  }

  ngOnDestroy() {
    this.sidebarVisibilitySubscription.unsubscribe();
  }
}
