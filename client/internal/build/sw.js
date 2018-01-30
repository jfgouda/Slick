importScripts('workbox-sw.prod.v2.1.2.js');
importScripts('workbox-background-sync.prod.v2.0.3.js');

const workboxSW = new WorkboxSW({
  skipWaiting: true,
  clientsClaim: true
});

const replayBroadcastChannel = new BroadcastChannel('SOCO_SW_SYNC');

replayBroadcastChannel.onmessage = function (ev) {
  // console.log(ev.data);
  // bgQueue.replayRequests(); // Depend on the message we can replay the queue
};

//workbox.LOG_LEVEL = workbox.LOG_LEVEL.debug;

// Cache Get APIs
// To be replaced with native SW APIs to hsandle offline first mechanism 
workboxSW.router.registerRoute(
  /(.*)\/api\/v1\/(.*)/,
  workboxSW.strategies.networkFirst({
    cacheName: 'SOCO-API',
    broadcastUpdate: {
      channelName: 'SOCO-API'
    },
  })
);

let bgQueue = new workbox.backgroundSync.QueuePlugin({
  callbacks: {
    replayDidSucceed: async(hash, res) => {
      // replayBroadcastChannel.postMessage({   // Inform Windows that replay succeed
      //   trigger: 'replayDidSucceed',
      //   hash: hash,
      //   res: res.clone()
      // });
      self.registration.showNotification('Southern Company - Gas Request', {
        body: 'Offline changes have been synchronized with server!',
        icon: './assets/mstile-150x150.png'
      });
    },
    // replayDidFail: (hash) => {
    //   replayBroadcastChannel.postMessage({
    //     trigger: 'replayDidFail',
    //     hash: hash
    //   });
    // },
    // requestWillEnqueue: (reqData) => {
    //   replayBroadcastChannel.postMessage({
    //     trigger: 'requestWillEnqueue',
    //     reqData: reqData
    //   });
    // },
    // requestWillDequeue: (reqData) => {
    //   replayBroadcastChannel.postMessage({
    //     trigger: 'requestWillDequeue',
    //     reqData: reqData
    //   });
    // }
  }
});

workboxSW.router.registerRoute(/(.*)\/api\/v1\/bca\/create(.*)/,
  workboxSW.strategies.networkOnly({
    plugins: [bgQueue]
  }), 'POST'
);

workboxSW.router.registerRoute(/(.*)\/api\/v1\/bca\/update(.*)/,
  workboxSW.strategies.networkOnly({
    plugins: [bgQueue]
  }), 'PUT'
);

workboxSW.router.registerRoute(/(.*)\/api\/v1\/bca\/delete(.*)/,
  workboxSW.strategies.networkOnly({
    plugins: [bgQueue]
  }), 'DELETE'
);

workboxSW.router.registerRoute(/(.*)\/api\/v1\/bca\/list(.*)/, (req) => {
  return bgQueue.replayRequests().then(() => {
    return fetch('https://localhost/sketch-server/api/v1/bca/list', {
      method: 'GET',
      headers: {
        // Read token from IDB instead of hardcoding
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEiLCJuYmYiOjE1MTU3Nzk3MzcsImV4cCI6MTUxNjM4NDUzNywiaWF0IjoxNTE1Nzc5NzM3fQ.7Qw_C1oBdm50TcGP8bAvI5U3ZU5lqdgOqNx7nIoVaCA',
        'Content-type': 'application/json',
      }
    });
  }).catch(err => {
    console.log("SW BG-Queue Reply Error: ", err);
    return err; // we will handle this error in main.js
  });
});


// let bgQueue = new workbox.backgroundSync.QueuePlugin('SOCO', {
//   callbacks: {
//     replayDidSucceed: async(hash, res) => {},
//     requestWillEnqueue: (reqData) => {},
//     requestWillDequeue: (reqData) => {},
//   }
// });

// let bgQueue = new workbox.backgroundSync.Queue();
// self.addEventListener('fetch', function(e) {
//   if (!e.request.url.startsWith('https://localhost/sketchgenerator/api/v1/bca')) return;

//   const clone = e.request.clone();
//   e.respondWith(fetch(e.request).catch((err) => {
//     bgQueue.pushIntoQueue({
//       request: clone,
//     });
//     throw err;
//   }));
// });

// Handle fetch requests for BCA APIs, and cache the failed requests
// self.addEventListener('fetch', function (e) {
//   if (!e.request.url.startsWith('https://localhost/sketchgenerator/api/v1/bca')) return;

//   const clone = e.request.clone();
//   e.respondWith(fetch(e.request).catch((err) => {
//     bgQueue.pushIntoQueue({
//       request: clone,
//     }).then((a, b, c) => {
//       debugger;
//     });

//     throw new Error('Network-Error: when attempting to fetch resource ' + clone.url);
//   }));
// });

// function jwt() {
//   // create authorization header with jwt token
//   const currentUser = getCurrentUser();

//   var currentUser = JSON.parse(currentUser.setting);
//   if (currentUser && currentUser.token) {
//     var headers = 'Bearer ' + currentUser.token;
//     return headers;
//   }
// }

// function createDB() {
//   idb.open('SOCO-SETTINGS', 1, function (upgradeDB) {
//     var store = upgradeDB.createObjectStore('SETTINGS', {
//       keyPath: 'id'
//     });
//   });
// }

// function getCurrentUser() {
//   debugger;
//   var request = indexedDB.open('SOCO-SETTINGS', 1);
//   request.onerror = function(event) {
//     alert("Why didn't you allow my web app to use IndexedDB?!");
//   };
//   request.onsuccess = function(event) {
//     var db = event.target.result;
//     var tx = db.transaction('SOCO-SETTINGS', 'readonly');
//     var store = tx.objectStore('SETTINGS');
//     var index = store.index('currentUser');
//     return index.get(key);
//   };

//   // return dbPromise.then(function (db) {
//   //   var tx = db.transaction('SOCO-SETTINGS', 'readonly');
//   //   var store = tx.objectStore('SETTINGS');
//   //   var index = store.index('currentUser');
//   //   return index.get(key);
//   // });
// }

workboxSW.precache([]);
