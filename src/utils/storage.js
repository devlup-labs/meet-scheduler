class StorageHandler {
  constructor() {
    // define different storage types such as chrome.local, chrome.sync, localstorage
    this.storageTypes = ['chrome_local', 'chrome_sync', 'local_storage'];
  }

  getStorageTypes() {
    return this.storageTypes;
  }

  // generic set method
  set(type, key, value) {
    const dict = {};
    dict[key] = value;

    if (type === 'chrome_local') {
      return new Promise((resolve) => {
        chrome.storage.local.set(dict, resolve);
      });
    } else if (type === 'chrome_sync') {
      return new Promise((resolve) => {
        chrome.storage.sync.set(dict, resolve);
      });
    } else if (type === 'local_storage') {
      return new Promise((resolve) => {
        localStorage.setItem(key, value);
        resolve();
      });
    } else {
      throw 'Unknow storage type';
    }
  }

  // generic get method
  get(type, key) {
    if (type === 'chrome_local') {
      return new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => resolve(result[key]));
      });
    } else if (type === 'chrome_sync') {
      return new Promise((resolve) => {
        chrome.storage.sync.get(key, (result) => resolve(result[key]));
      });
    } else if (type === 'local_storage') {
      return new Promise((resolve) => {
        resolve(localStorage.getItem(key));
      });
    } else {
      throw 'Unknow storage type';
    }
  }

  // generic getAll method
  getAll(type) {
    if (type === 'chrome_local') {
      return new Promise((resolve) => {
        chrome.storage.local.get(null, (result) => resolve(result || {}));
      });
    } else if (type === 'chrome_sync') {
      return new Promise((resolve) => {
        chrome.storage.sync.get(null, (result) => resolve(result || {}));
      });
    } else if (type === 'local_storage') {
      return new Promise((resolve) => {
        var archive = {};
        const keys = Object.keys(localStorage);
        i = keys.length;

        while (i--) {
          archive[keys[i]] = localStorage.getItem(keys[i]);
        }
        resolve(archive);
      });
    } else {
      throw 'Unknow storage type';
    }
  }

  // generic remove method
  remove(type, key) {
    if (type === 'chrome_local') {
      return new Promise((resolve) => {
        chrome.storage.local.remove(key, resolve);
      });
    } else if (type === 'chrome_sync') {
      return new Promise((resolve) => {
        chrome.storage.sync.remove(key, resolve);
      });
    } else if (type === 'local_storage') {
      return new Promise((resolve) => {
        localStorage.removeItem(key);
        resolve();
      });
    } else {
      throw 'Unknow storage type';
    }
  }

  // generic removeall method
  removeAll(type) {
    if (type === 'chrome_local') {
      return new Promise((resolve) => {
        chrome.storage.local.clear(resolve);
      });
    } else if (type === 'chrome_sync') {
      return new Promise((resolve) => {
        chrome.storage.sync.clear(resolve);
      });
    } else if (type === 'local_storage') {
      return new Promise((resolve) => {
        localStorage.clear();
        resolve();
      });
    } else {
      throw 'Unknow storage type';
    }
  }
}

export const storageHandler = new StorageHandler();
