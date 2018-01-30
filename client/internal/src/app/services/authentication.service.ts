import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AngularIndexedDB } from 'angular2-indexeddb';

//import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';

import { AppConfig } from 'app/app.config';

@Injectable()
export class AuthenticationService {
    private dbName: string = 'SOCO-SETTINGS';
    private dbStore: string = 'SETTINGS';
    private dbStoreKeyPath: string = 'id';
    private dbStoreIndex: string = 'settingName';
    private dbVersion: number = 1;
    private db = new AngularIndexedDB(this.dbName, this.dbVersion);

    constructor(private http: HttpClient, private config: AppConfig) {
        this.openDatabase();
    }

    login(username: string, password: string) {
        return this.http.post(this.config.apiUrl + '/users/authenticate', { username: username, password: password })
            .map((response: any) => {
                // login successful if there's a jwt token in the response
                if (response && response.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(response));
                    // this.addSetting({
                    //     settingName: 'currentUser',
                    //     setting: JSON.stringify(response)
                    // });
                }
            })
            .catch(this.handleError);
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        //this.deleteSetting("currentUser");
    }


    private openDatabase() {
        this.db.openDatabase(this.dbVersion, (evt) => {
            debugger;
            let objectStore = evt.currentTarget.result.createObjectStore(this.dbStore, {
                keyPath: this.dbStoreKeyPath
            });

            objectStore.createIndex(this.dbStoreIndex, this.dbStoreIndex, { unique: true });
        });
    }


    public findBySettingId(settingtId: string) {
        return this.db.getByIndex(this.dbStore, this.dbStoreIndex, settingtId);
    }

    public addSetting(setting: any) {
        return this.db.add(this.dbStore, setting);
    }

    public updateSetting(setting: any) {
        return this.db.update(this.dbStore, setting, setting.id);
    }

    public deleteSetting(settingtId: string) {
        this.findBySettingId(settingtId).then((item) => {
            if (item && item !== undefined)
                return this.db.delete(this.dbStore, item.id);
        });
    }

    private handleError(error: any) {
        let errorObj;
        let errMsg;
        let err;

        try {
            errorObj = error.json().error;
        } catch (e) {

        }

        if (errorObj) {
            errMsg = (errorObj.message) ? errorObj.message :
                errorObj.status ? `${errorObj.status} - ${errorObj.statusText}` : 'Server error';
            err = errorObj;
        }
        else {
            errMsg = (error.message) ? error.message :
                error.status ? `${error.status} - ${error.statusText}` : 'Server error';
            err = error;
        }
        console.error(err);
        return Observable.throw(errMsg);
    }
}