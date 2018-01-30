import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

// Observable class extensions
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { AppConfig } from 'app/app.config';
import { BCA } from 'app/modules/bca/_model/bca';

@Injectable()
export class BCAService {
    constructor(private http: Http, private config: AppConfig) { }

    getAllBCAs() {
        return this.http.get(this.config.apiUrl + '/bca/list', this.jwt())
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    getBCAById(id: number) {
        return this.http.get(this.config.apiUrl + '/bca/get/' + id, this.jwt())
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    updateBCA(bca: BCA) {
        return this.http.put(this.config.apiUrl + '/bca/update/' + bca.id, bca, this.jwt())
            .map((response: Response) => response.json())
            .catch(this.handleError);
    }

    createBCA(bca: BCA) {
        let root = this;
        let url = this.config.apiUrl + '/bca/create';
        return this.http.post(this.config.apiUrl + '/bca/create', bca, this.jwt())
            .catch(this.handleError);

        // .catch((error) => {
        //     // let req = new RequestWrapper();
        //     // req.id = new Date().getTime();
        //     // req.isProcessed = false;

        //     // req.request.timestamp = new Date();
        //     // req.request.verb = HttpVerbs.post;
        //     // req.request.endpoint.url = url;
        //     // req.request.endpoint.serverRoot = this.config.apiUrl;
        //     // req.request.endpoint.apiMethod = '/bca/create';
        //     // req.request.body = bca;
        //     // req.response = root.ParseError(error);
        //     // root.syncManager.addRequest(req);

        //     return Observable.throw(new Error(error.status));
        // });
    }

    deleteBCA(id: number) {
        return this.http.delete(this.config.apiUrl + '/bca/delete/' + id, this.jwt())
            .catch(this.handleError);
    }

    private jwt() {
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

    // private ParseError(error: any): any {
    //     let errorObj;
    //     let errMsg;
    //     let err;

    //     try {
    //         errorObj = error.json().error;
    //     } catch (e) {

    //     }

    //     if (errorObj) {
    //         errMsg = (errorObj.message) ? errorObj.message :
    //             errorObj.status ? `${errorObj.status} - ${errorObj.statusText}` : 'Server error';
    //         err = errorObj;
    //     }
    //     else {
    //         errMsg = (error.message) ? error.message :
    //             error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    //         err = error;
    //     }

    //     return {
    //         ok: error.ok,
    //         status: error.status,
    //         statusText: error.statusText,
    //         type: error.type,
    //         url: error.url,
    //         message: errMsg,
    //     }
    // }
}