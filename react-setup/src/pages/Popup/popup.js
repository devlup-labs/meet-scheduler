class Alarm {
    constructor(description) {
      this.generateID = function () {
        var dt = new Date().getTime();
        var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
          /[xy]/g,
          function (c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
          }
        );
        return uuid;
      };
      this.id = this.generateID();
      this.link = description["G"];
      this.desc = description;
    }
}

async function setDataIntoStorage(key, value) {
    const dict = {};
    dict[key] = value;
    return await new Promise((resolve) => {
      chrome.storage.sync.set(dict, resolve);
    });
}
  
async function getAllDataFromStorage() {
    return await new Promise((resolve) => {
        chrome.storage.sync.get(null, (result) => resolve(result || {}));
    });
}
  
async function removeDataFromStorage(key) {
    return await new Promise((resolve) => {
        chrome.storage.sync.remove(key, resolve);
    });
}

function button_click(description) {
    var alarm_data = new Alarm(description);
    console.log(alarm_data);
    setDataIntoStorage(alarm_data.id, alarm_data);
}

export { button_click, getAllDataFromStorage, removeDataFromStorage }
