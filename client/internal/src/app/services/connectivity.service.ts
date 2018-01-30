import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ConnectivityStatus } from 'app/shared/models/connectivity-status.model';

@Injectable()
export class ConnectivityService {
    private _connectivityStatus: ConnectivityStatus = new ConnectivityStatus();
    private _broadcastEvent: MessageEvent = new MessageEvent('broadcast');

    private _isConnected = new BehaviorSubject<boolean>(true);
    private _connectivityStatusSubject = new BehaviorSubject<ConnectivityStatus>(this._connectivityStatus);
    private _swBroadcast = new BehaviorSubject<MessageEvent>(this._broadcastEvent);

    public internetConnectivity = this._isConnected.asObservable();
    public connectivityStatusSubject = this._connectivityStatusSubject.asObservable();
    public swBroadcastSubject = this._swBroadcast.asObservable();

    private bcc = new BroadcastChannel('SOCO_SW_SYNC');

    constructor() {
        this.bindNetworkEventListener();
        this.bindSWBroadcast();
    }

    private bindNetworkEventListener() {
        window.addEventListener('online', () => {
            console.log('%cNavigator: Went Online!', 'color: green');
            this._connectivityStatus.networkAvailability = true;
            this._isConnected.next(true);
            this.setConnectivityStatus(this._connectivityStatus);
        }, false);

        window.addEventListener('offline', () => {
            console.log('%cNavigator: Went Offline!', 'color: red');
            this._connectivityStatus.networkAvailability = false;
            this._isConnected.next(false);
            this.setConnectivityStatus(this._connectivityStatus);
        }, false);
    }

    private bindSWBroadcast() {
        this.bcc.onmessage = (ev) => {
            this._swBroadcast.next(ev);
        };
    }

    public setConnectivityStatus(status: ConnectivityStatus) {
        this._connectivityStatus = status;
        this._connectivityStatusSubject.next(this._connectivityStatus);
    }

    public broadcastMessageToSW(message: string) {
        this.bcc.postMessage(message);
    }
}