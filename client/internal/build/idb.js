export let idbKeyval = (() => {
    let db;
  
    function getDB() {
      if (!db) {
        db = new Promise((resolve, reject) => {
          const openreq = indexedDB.open('SOCO-SETTINGS', 1);
  
          openreq.onerror = () => {
            reject(openreq.error);
          };
  
          openreq.onupgradeneeded = () => {
            // First time setup: create an empty object store
            openreq.result.createObjectStore('SETTINGS');
          };
  
          openreq.onsuccess = () => {
            resolve(openreq.result);
          };
        });
      }
      return db;
    }
  
    async function withStore(type, callback) {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction('SETTINGS', type);
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
        callback(transaction.objectStore('SETTINGS'));
      });
    }
  
    return {
      async get(key) {
        let req;
        await withStore('readonly', store => {
          req = store.get(key);
        });
        return req.result;
      },
      set(key, value) {
        return withStore('readwrite', store => {
          store.put(value, key);
        });
      },
      delete(key) {
        return withStore('readwrite', store => {
          store.delete(key);
        });
      }
    };
  })();
  
  // iOS add-to-homescreen is missing IDB, or at least it used to.
  // I haven't tested this in a while.
  if (!self.indexedDB) {
    idbKeyval = {
      get: key => Promise.resolve(localStorage.getItem(key)),
      set: (key, val) => Promise.resolve(localStorage.setItem(key, val)),
      delete: key => Promise.resolve(localStorage.removeItem(key))
    };
  }