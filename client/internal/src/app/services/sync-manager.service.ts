// import { Injectable } from '@angular/core';
// import { AngularIndexedDB } from 'angular2-indexeddb';

// @Injectable()
// export class SyncService {
//     private dbName: string;
//     private dbStore: string;
//     private dbStoreKeyPath: string;
//     private dbVersion: number = 1;
//     private dbindices: DBIndex[];
//     private db: AngularIndexedDB;

//     constructor(config: any) {
//         this.dbName = config.dbName;
//         this.dbStore = config.dbStore;
//         this.dbStoreKeyPath = config.dbStoreKeyPath;
//         this.dbVersion = config.dbVersion;
//         this.dbindices = config.dbindices;

//         this.db = new AngularIndexedDB(this.dbName, this.dbVersion);
//         this.openDatabase();
//     }

//     private openDatabase() {
//         this.db.openDatabase(this.dbVersion, (evt) => {
//             let objectStore = evt.currentTarget.result.createObjectStore(this.dbStore, {
//                 keyPath: this.dbStoreKeyPath,
//                 autoIncrement: true
//             });

//             this.dbindices.forEach(index => {
//                 objectStore.createIndex(index.name, index.name, { unique: index.unique });
//             });
//         });
//     }

//     public getAll() {
//         return this.db.getAll(this.dbStore);
//     }

//     public findById(id: string) {
//         return this.db.getByKey(this.dbStore, id);
//     }

//     public findByIndex(indexName: string, indexValue: string) {
//         return this.db.getByIndex(this.dbStore, indexName, indexValue);
//     }

//     public add(data: any) {
//         return this.db.add(this.dbStore, data);
//     }

//     public update(data: any) {
//         return this.db.update(this.dbStore, data);
//     }

//     public delete(id: any) {
//         return this.db.delete(this.dbStore, id);
//     }

//     public clear() {
//         return this.db.clear(this.dbStore);
//     }
// }

// export class DBIndex {
//     name: string;
//     unique: boolean;
// }

// // export class RequestWrapper {
// //     id: number;
// //     isProcessed: boolean;
// //     request: Request;
// //     response: any;

// //     constructor() {
// //         this.request = new Request();
// //     }
// // }

// // export class Request {
// //     verb: HttpVerbs;
// //     endpoint: EndPoint;
// //     body: any;
// //     timestamp: Date;

// //     constructor() {
// //         this.endpoint = new EndPoint();
// //     }
// // }

// // export class EndPoint {
// //     url: string;
// //     serverRoot: string;
// //     apiMethod: string;
// // }

// // export enum HttpVerbs {
// //     get = "GET",
// //     put = "PUT",
// //     post = "POST",
// //     delete = "DELETE"
// // };