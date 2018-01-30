import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as jQuery from 'jquery';

declare const $: any;

@Injectable()
export class ShellService {
    private _shellVisibility = new BehaviorSubject<boolean>(true);
    private _sidebarVisibility = new BehaviorSubject<boolean>(false);

    shellVisibility = this._shellVisibility.asObservable();
    sidebarVisibility = this._sidebarVisibility.asObservable();

    constructor() { }

    setShellVisibility(state: boolean) {
        setTimeout(() => {
            this._shellVisibility.next(state);
            $('body').removeClass(state ? 'login-container' : 'has-detached-right').addClass(state ? 'has-detached-right' : 'login-container');
        });
    }

    setSideBarVisibility(state: boolean) {
        setTimeout(() => {
            this._sidebarVisibility.next(state);
        });
    }
}