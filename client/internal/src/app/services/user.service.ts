import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { AppConfig } from 'app/app.config';
import { User } from 'app/modules/security/_model/user';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {
    constructor(private http: Http, private config: AppConfig) { }

    getAll() {
        return this.http.get(this.config.apiUrl + '/users', this.jwt())
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    getById(id: number) {
        return this.http.get(this.config.apiUrl + '/users/' + id, this.jwt())
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    create(user: User) {
        return this.http.post(this.config.apiUrl + '/users', user, this.jwt())
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    update(user: User) {
        return this.http.put(this.config.apiUrl + '/users/' + user.id, user, this.jwt())
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    delete(id: number) {
        return this.http.delete(this.config.apiUrl + '/users/' + id, this.jwt())
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    // private helper methods

    jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }

    private handleError(error: any) {
        let errorObj;
        let errMsg;
        let err;

        try{
            errorObj = error.json().error;
        }catch(e){

        }

        if(errorObj){
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