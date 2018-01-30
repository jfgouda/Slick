export class ConnectivityStatus {
    constructor() {
        this.fetchStopwacthe = new ConnectivityStopwacthe();
        this.serverFailed = false;
        this.serverDataLoaded = false;
        this.networkAvailability = window.navigator.onLine;
        this.serverAvailability = 1;
        this.cahceAvailability = 1;
        this.fetchStopwacthe.serverTime = 0;
        this.fetchStopwacthe.cacheTime = 0;
        this.fetchStopwacthe.startTime = 0;
        this.fetchStopwacthe.serverDuration = '0';
        this.fetchStopwacthe.cacheDuration = '0';
    }

    serverFailed: boolean;
    serverDataLoaded: boolean;
    networkAvailability: boolean;
    cahceAvailability: number;
    serverAvailability: number;
    fetchStopwacthe: ConnectivityStopwacthe;
}

export class ConnectivityStopwacthe {
    serverTime: number;
    cacheTime: number;
    startTime: number;
    serverDuration: string;
    cacheDuration: string;
    isLogged: boolean;
}

export enum fetchStatus {
    offline = 'offline',
    noOfflineData = 'noOfflineData',
    onlineDataSaved = 'onlineDataSaved',
    errorSavingData = 'errorSavingData'
};