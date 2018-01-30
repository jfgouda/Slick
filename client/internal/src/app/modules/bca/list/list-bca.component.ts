// #region >> [Imports & Declarations]
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/finally';

import { IDBManager } from 'app/shared/helpers/idb';

import { BCAService } from 'app/services/bca.service';
import { ConnectivityService } from 'app/services/connectivity.service';
import { AlertService } from 'app/services';

import { AppConfig } from 'app/app.config';
import { BCA } from 'app/modules/bca/_model/bca';
import { ConnectivityStatus, fetchStatus } from 'app/shared/models/connectivity-status.model';

import * as jQuery from 'jquery';

declare const $: any;
declare const _: any;
// #endregion

@Component({
    moduleId: module.id,
    selector: 'app-bca-list',
    templateUrl: 'list-bca.component.html'
})

export class ListBCAComponent implements OnInit, AfterViewInit {
    // #region |-> [Variables]
    private bcaAPIs = {
        listUrl: this.config.apiUrl + '/bca/list/',
        deleteUrl: this.config.apiUrl + '/bca/delete/'
    }
    private idb = new IDBManager({
        dbName: 'SOCO-API-Sync',
        dbStore: 'Requests',
        dbStoreKeyPath: 'url',
        dbVersion: 1,
        dbindices: []
    });

    bcaList = new Array<BCA>();
    dtOptions: any = {};
    dtTrigger: Subject<any> = new Subject();
    @ViewChild(DataTableDirective) dtElement: DataTableDirective;
    connectivitySubscription: Subscription;
    swBroadcastSubscription: Subscription;
    connectivityStatus: ConnectivityStatus;
    // #endregion

    // #region |-> [Ctor & Initiation]
    constructor(
        private bcaService: BCAService,
        private config: AppConfig,
        private alertService: AlertService,
        private connectivityService: ConnectivityService) {
        this.connectivityStatus = new ConnectivityStatus();
    }

    ngOnInit() {
        this.dtOptions = {
            autoWidth: false,
            responsive: true,
            columnDefs: [{
                orderable: false,
                width: '140px',
                targets: [5]
            }],
            dom: '<"datatable-header"fBl><"datatable-scroll-wrap"t><"datatable-footer"ip>',
            language: {
                search: '<span>Filter:</span> _INPUT_',
                lengthMenu: '<span>Show:</span> _MENU_',
                searchPlaceholder: "Type to filter...",
                paginate: {
                    'first': 'First',
                    'last': 'Last',
                    'next': '&rarr;',
                    'previous': '&larr;'
                }
            },
            buttons: {
                buttons: [
                    {
                        extend: 'copyHtml5',
                        className: 'btn btn-default',
                        text: '<i class="icon-copy3 position-left"></i>',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4]
                        }
                    },
                    {
                        extend: 'print',
                        className: 'btn btn-default',
                        text: '<i class="icon-printer position-left"></i>',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4]
                        }
                    },
                    {
                        extend: 'excelHtml5',
                        className: 'btn btn-default',
                        text: '<i class="icon-file-spreadsheet position-left"></i>',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4]
                        }
                    },
                    {
                        extend: 'pdfHtml5',
                        className: 'btn btn-default',
                        text: '<i class="icon-file-pdf position-left"></i>',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4]
                        }
                    },
                    {
                        extend: 'colvis',
                        text: '<i class="icon-three-bars"></i> <span class="caret"></span>',
                        className: 'btn bg-blue btn-icon'
                    }
                ]
            },
            stateSave: true,
            drawCallback: function () {
                $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').addClass('dropup');
            },
            preDrawCallback: function () {
                $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').removeClass('dropup');
            }
        };

        // This code sets up a listener for messages broadcast to 'test-file-updates'.
        // Those messages will come from the service worker if the response for a file
        // received from the network is different from the previously cached response.
        const updatesChannel = new BroadcastChannel('SOCO-API');
        updatesChannel.addEventListener('message', (event) => {
            console.log('info', `The network response has a different Date: header than the cached response: ${JSON.stringify(event.data)}`);
        }, false);
    }

    ngAfterViewInit(): void {
        let root = this;
        root.idb.openDatabase().then(() => {    // Wait for the IDB Promiss to resolve before fetch contents
            this.swBroadcastSubscription =
                this.connectivityService.swBroadcastSubject.subscribe(event => {
                    console.log(event);
                });

            this.connectivitySubscription =     // Listen for connectivity events, and fetch data accordingly
                this.connectivityService.internetConnectivity.subscribe(connected => {
                    root.fetchBcaData();        // Fetch data from cache and server
                });
            root.dtTrigger.next();              // First datatables init
        });
    }

    ngOnDestroy() {
        this.connectivitySubscription.unsubscribe();
    }
    // #endregion

    // #region |-> [Fetch Operations - Server & Cache]
    fetchBcaData() {
        let root = this;
        root.resetConnectivityStatus();

        // Don't wait for server data, try fetch it from cache
        root.fetchBcaFromCache()                                                                    // attempt to get local data from IDB
            .then(cachedData => {
                root.connectivityStatus.fetchStopwacthe.cacheTime = performance.now();              // Inform the performance logger that cached data loaded
                if (!cachedData) {                                                                  // alert user if there is no local data, if user is online then fresh data will be fetched from server
                    root.notifyUser(fetchStatus.noOfflineData);                                     // alert user that no local data is available
                    root.connectivityStatus.cahceAvailability = 0;
                } else {                                                                            // alert user that local data found, and unlock the UI, and if user is online, fresh data will be fetched from server
                    root.connectivityStatus.cahceAvailability = 2;
                    if (!root.connectivityStatus.serverDataLoaded) {                                // just in case if network is faster that disk, make sure we don't overwrite server data
                        root.notifyUser(fetchStatus.offline);                                       // alert user that we are using local data (possibly outdated)
                        root.updateUI(cachedData.data);                                             // display local data on page
                    } else
                        console.log('Info: Data fetched from server faster than cache, ignore cached data.');
                }
                root.connectivityService.setConnectivityStatus(root.connectivityStatus);
            })

        // Fire a network fetch, and carry on with a cached data, if any.
        root.fetchBcaFromServer()                                                                   // try fetch data from server
            .then(onlineData => {
                root.connectivityStatus.serverAvailability = 2;
                root.connectivityStatus.fetchStopwacthe.serverTime = performance.now();             // Inform the performance logger that server data loaded
                root.connectivityStatus.serverFailed = false;
                root.connectivityStatus.serverDataLoaded = true;                                    // if network respond come first, prevent cach to overwrite
                root.connectivityService.setConnectivityStatus(root.connectivityStatus);
                root.updateUI(onlineData);                                                          // display server data on page
                root.saveBcaToCache(onlineData)                                                     // update local copy of data in IDB
                    .then(() => {
                        root.setLastUpdated(new Date());                                            // mark when the local data was last updated
                        root.notifyUser(fetchStatus.onlineDataSaved);                               // alert user that data has been saved locally
                        root.connectivityStatus.cahceAvailability = 2;
                        root.connectivityService.setConnectivityStatus(root.connectivityStatus);
                    }).catch(err => {
                        root.notifyUser(fetchStatus.errorSavingData);                               // alert user that there was an error saving data
                        console.warn(err);
                        root.connectivityStatus.cahceAvailability = 0;
                        root.connectivityService.setConnectivityStatus(root.connectivityStatus);
                    });
            }).catch(err => {                                                                       // if we can't connect to the server...
                root.connectivityStatus.serverFailed = true;
                root.connectivityStatus.serverDataLoaded = false;                                   // if network respond come first, prevent cach to overwrite
                root.connectivityStatus.serverAvailability = 0;
                root.connectivityStatus.fetchStopwacthe.serverTime = performance.now();             // Inform the performance logger that server data loaded
                root.connectivityService.setConnectivityStatus(root.connectivityStatus);
                console.log('Warning: Network requests have failed, this is expected if offline: ', err);
            });
    }

    fetchBcaFromServer() {
        let root = this;
        return fetch(root.bcaAPIs.listUrl, {
            method: 'GET',
            headers: root.getFetchHeader()
        }).then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        });
    }

    fetchBcaFromCache() {
        return this.idb.findById(this.bcaAPIs.listUrl);
    }

    saveBcaToCache(list) {
        return this.idb.update({
            url: this.bcaAPIs.listUrl,
            data: list
        });
    }

    deleteBCA(id: number) {
        let root = this;
        root.blockUI(true);

        // Delete data from server
        root.deleteBcaFromServer(id)
            .then(response => {
            })
            .catch(error => {
                console.dir(error);
            }).then(() => {
                root.blockUI(false);
                root.bcaList = _.reject(root.bcaList, (b) => { return b.id === id; });
                root.updateUI(root.bcaList);
                root.saveBcaToCache(root.bcaList)                           // update local copy of data in IDB
                    .then(() => {
                        this.setLastUpdated(new Date());                    // mark when the local data was last updated
                        root.notifyUser(fetchStatus.onlineDataSaved);       // alert user that data has been saved locally
                    }).catch(err => {
                        root.notifyUser(fetchStatus.errorSavingData);       // alert user that there was an error saving data
                        console.warn(err);
                    });
            });

        // root.bcaService.deleteBCA(id)
        //     .finally(() => {
        //         root.blockUI(false);
        //     })
        //     .subscribe(data => {
        //         root.bcaList = _.reject(root.bcaList, (b) => { return b.id === id; });
        //         root.updateUI(root.bcaList);
        //         root.saveBcaToCache(root.bcaList)                           // update local copy of data in IDB
        //             .then(() => {
        //                 this.setLastUpdated(new Date());                    // mark when the local data was last updated
        //                 root.notifyUser(fetchStatus.onlineDataSaved);       // alert user that data has been saved locally
        //             }).catch(err => {
        //                 root.notifyUser(fetchStatus.errorSavingData);       // alert user that there was an error saving data
        //                 console.warn(err);
        //             });
        //     },
        //     error => {
        //         console.dir(error);
        //     });
    }

    deleteBcaFromServer(id: number) {
        let root = this;
        return fetch(root.bcaAPIs.deleteUrl + id, {
            method: 'DELETE',
            headers: root.getFetchHeader()
        }).then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response;
        });
    }
    // #endregion

    // #region |-> [Fetch Helper Functions]
    updateUI(data) {
        let root = this;
        root.bcaList = data;
        $.extend($.fn.dataTable.defaults, {
            "fnInitComplete": function (oSettings, json) {
                root.attachDataTableFeatures();
            },
        });
        root.rerenderDataTable();
        root.blockUI(false);
    }

    resetConnectivityStatus() {
        console.info('%cInfo: Fetching BCA list using cache first strategy', 'color: yellow');

        let root = this;
        root.blockUI(true);
        root.connectivityStatus.serverFailed = false;
        root.connectivityStatus.serverDataLoaded = false;
        root.connectivityStatus.cahceAvailability = 1;
        root.connectivityStatus.serverAvailability = 1;
        root.connectivityStatus.fetchStopwacthe.serverTime = 0;
        root.connectivityStatus.fetchStopwacthe.cacheTime = 0;
        root.connectivityStatus.fetchStopwacthe.startTime = performance.now();
        root.connectivityStatus.fetchStopwacthe.isLogged = false;
        root.connectivityService.setConnectivityStatus(root.connectivityStatus);
    }

    getFetchHeader() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        return {
            'Authorization': (currentUser && currentUser.token) ? 'Bearer ' + currentUser.token : '',
            'Content-type': 'application/json',
        }
    }

    getLastUpdated() {
        return localStorage.getItem('lsBCALastUpdated');
    }

    setLastUpdated(date) {
        localStorage.setItem('lsBCALastUpdated', date);
    }
    // #endregion

    // #region |-> [Fetch Notifications Functions]
    notifyUser(state: fetchStatus) {
        let message;
        const lastUpdated = this.getLastUpdated();
        switch (state) {
            case fetchStatus.offline:
                message = "You're offline and viewing stored data."
                if (lastUpdated) message += ' Last fetched server data: ' + lastUpdated;
                this.alertService.warning(message, false);
                break;
            case fetchStatus.noOfflineData:
                this.alertService.error("You're offline and local data is unavailable.", false);
                break;
            case fetchStatus.onlineDataSaved:
                message = "Server data was saved for offline mode"
                if (lastUpdated) { message += ' on ' + lastUpdated; }
                this.alertService.success(message, false);
                break;
            case fetchStatus.errorSavingData:
                this.alertService.error("Server data couldn't be saved offline :(", false);
                break;
        }
        this.blockUI(false);
    }
    // #endregion

    rerenderDataTable(): void {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            if (!this.dtTrigger.isStopped) {
                dtInstance.destroy();
                this.dtTrigger.next();
            }
        });
    }

    attachDataTableFeatures() {
        $('.dataTables_length select').select2({
            minimumResultsForSearch: Infinity,
            width: 'auto'
        });

        $('.datatable-bcaList tbody').on('click', 'tr', function () {
            $(this).addClass("success").siblings().removeClass("success");
        });

        let lastIdx = null;
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
            $('.datatable-bcaList tbody').on('mouseover', 'td', function () {
                if (dtInstance.cell(this).index()) {
                    let colIdx = dtInstance.cell(this).index().column;
                    if (colIdx !== lastIdx) {
                        $(dtInstance.cells().nodes()).removeClass('active');
                        $(dtInstance.column(colIdx).nodes()).addClass('active');
                    }
                }
            }).on('mouseleave', function () {
                $(dtInstance.cells().nodes()).removeClass('active');
            });
        });


    }

    blockUI(blocked: boolean) {
        if (!blocked) {
            $("#contentPanel").unblock();
            return;
        }
        $("#contentPanel").block({
            message: '<i class="icon-spinner2 spinner"></i>',
            overlayCSS: {
                backgroundColor: '#fff',
                opacity: 0.8,
                cursor: 'wait',
                'box-shadow': '0 0 0 1px #ddd'
            },
            css: {
                border: 0,
                padding: 0,
                backgroundColor: 'none'
            }
        });
    }
}
