import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ShellService } from 'app/services/shell.service';

declare const Notification: any;
Notification.requestPermission();

@Component({
  selector: 'app-shell',
  templateUrl: './app.shell.component.html'
})
export class AppShellComponent implements OnInit {
  shellVisibility: boolean;
  shellVisibilitySubscription: Subscription;

  constructor(private shellService: ShellService) { }

  ngOnInit() {
    this.shellVisibilitySubscription = this.shellService.shellVisibility.subscribe(visibility => this.shellVisibility = visibility);
  }

  ngOnDestroy() {
    this.shellVisibilitySubscription.unsubscribe();
  }
}
