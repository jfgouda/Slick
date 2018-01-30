import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ShellService } from 'app/services/shell.service';
import { UserService } from 'app/services/user.service';
import { AlertService } from 'app/services/alert.service';
import { environment } from 'environments/environment';

declare const moment: any;

@Component({
    moduleId: module.id,
    templateUrl: 'register.component.html'
})

export class RegisterComponent {
    model: any = {};
    loading = false;
    appVersion;
    appYear;

    constructor(
        private router: Router,
        private shellService: ShellService,
        private userService: UserService,
        private alertService: AlertService) {
        this.appVersion = environment.version;
        this.appYear = moment().year();
    }

    ngOnInit() {
        this.shellService.setShellVisibility(false);
    }

    ngOnDestroy() {
    }

    register() {
        this.loading = true;
        this.userService.create(this.model)
            .subscribe(
            data => {
                this.alertService.success('Registration successful', true);
                this.router.navigate(['/login']);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }
}
