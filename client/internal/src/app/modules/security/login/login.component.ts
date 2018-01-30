import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ShellService } from 'app/services/shell.service';
import { AuthenticationService } from 'app/services/authentication.service';
import { AlertService } from 'app/services/alert.service';
import { environment } from 'environments/environment';

declare const moment: any;

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    returnUrl: string;
    appVersion;
    appYear;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private shellService: ShellService,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) {
        this.appVersion = environment.version;
        this.appYear = moment().year();
    }

    ngOnInit() {
        this.shellService.setShellVisibility(false);

        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    ngOnDestroy() {
        //this.shellService.setShellVisibility(true);
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(
            data => {
                this.router.navigate([this.returnUrl]);
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }
}
