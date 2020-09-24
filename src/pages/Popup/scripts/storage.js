async function setDataIntoStorage(key, value) {
  const dict = {};
  dict[key] = value;
  return await new Promise((resolve) => {
    chrome.storage.sync.set(dict, resolve);
  });
}

async function getAllDataFromStorage() {
  var resp = await new Promise((resolve) => {
    chrome.storage.sync.get(null, (result) => resolve(result || {}));
  });
  delete resp.Defaults;
  delete resp.extensionToggle;
  return resp;
}

async function removeDataFromStorage(key) {
  return await new Promise((resolve) => {
    chrome.storage.sync.remove(key, resolve);
  });
}

async function getDataFromStorage(key) {
  return await new Promise((resolve) => {
    chrome.storage.sync.get(key, (result) => resolve(result[key]));
  });
}

export { getDataFromStorage, getAllDataFromStorage, removeDataFromStorage, setDataIntoStorage }

