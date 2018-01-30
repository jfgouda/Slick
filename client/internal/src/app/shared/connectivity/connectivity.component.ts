import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AlertService } from 'app/services/alert.service';
import { ConnectivityService } from 'app/services/connectivity.service';
import { Subscription } from 'rxjs/Subscription';
import { ConnectivityStatus } from 'app/shared/models/connectivity-status.model';
import * as jQuery from 'jquery';

declare const $: any;

@Component({
    moduleId: module.id,
    selector: 'connectivity',
    templateUrl: 'connectivity.component.html'
})
export class ConnectivityComponent implements OnInit, AfterViewInit {
    connectivityStatusSubscription: Subscription;
    connectivityStatus: ConnectivityStatus;
    message: any;

    constructor(
        private alertService: AlertService,
        private connectivityService: ConnectivityService) { }

    ngOnInit() {
        this.connectivityStatusSubscription = this.connectivityService.connectivityStatusSubject.subscribe(state => {
            this.connectivityStatus = state;
            this.logExecutionTime();
        });
        this.alertService.getMessage().subscribe(message => { this.message = message; });
    }

    logExecutionTime() {
        let executionDetails, executionMessage;

        if (this.connectivityStatus.fetchStopwacthe.cacheTime > 0)
            this.connectivityStatus.fetchStopwacthe.cacheDuration = (this.connectivityStatus.fetchStopwacthe.cacheTime - this.connectivityStatus.fetchStopwacthe.startTime).toFixed(2) + ' ms';
        if (this.connectivityStatus.fetchStopwacthe.serverTime > 0)
            this.connectivityStatus.fetchStopwacthe.serverDuration = (this.connectivityStatus.fetchStopwacthe.serverTime - this.connectivityStatus.fetchStopwacthe.startTime).toFixed(2) + ' ms';

        if (this.connectivityStatus.fetchStopwacthe.cacheTime > 0 && this.connectivityStatus.fetchStopwacthe.serverTime > 0 && !this.connectivityStatus.fetchStopwacthe.isLogged) {
            this.connectivityStatus.fetchStopwacthe.isLogged = true;
            executionDetails = 'Info: The fetch request measured -> Cache: ' +
                (this.connectivityStatus.fetchStopwacthe.cacheTime - this.connectivityStatus.fetchStopwacthe.startTime).toFixed(2) + ' ms | -> Server: ' +
                (this.connectivityStatus.fetchStopwacthe.serverTime - this.connectivityStatus.fetchStopwacthe.startTime).toFixed(2) + ' ms';
            executionMessage = this.connectivityStatus.serverFailed ? "Warning: Data fetched from cache as the server is unavailable!" : "Info: Data fetched from cache and then updated from server!";
            console.info(executionMessage);
            console.info(executionDetails);
        }
    }

    ngAfterViewInit(): void {
        $('[data-popup="popover"]').popover();
        $('[data-popup="tooltip"]').tooltip();
    }

    ngOnDestroy() {
        this.connectivityStatusSubscription.unsubscribe();
    }
}