class Sheet {
  constructor(url) {
    this.url = url;
  }

  async getResponse() {
    //get response form local database
    var data = await new Promise((resolve) => {
      chrome.storage.local.get(this.url, (result) => resolve(result[this.url]));
    });
    if (data) {
      this.response = data.response
      this.last_accessed = data.last_accessed
    }
    // if sheet is older than 4 hrs. then re fetch it
    const min = 240;
    if (!this.response || Date.now() - this.last_accessed > min * 60000) {
      await this.hardFetch();
    }
    else {
      console.debug("cache:: used sheet from cache")
    }
    return this.response;
  }

  async hardFetch() {
    //fetch data
    var resp = await fetch(this.url);
    if (resp.ok) {
      this.response = await resp.json();
      this.last_accessed = Date.now();
      //set data in local storage
      var val = {};
      val[this.url] = {
        response: this.response,
        last_accessed: this.last_accessed
      }
      await chrome.storage.local.remove(this.url)
      chrome.storage.local.set(val, function () {
        console.log('Sheet refected and set to' + val);
      });
    } else {
      this.response = false;
    }
  }
}

class SheetManager {
  constructor() {
    this.sheets = {};
  }

  async getSheet(url) {
    if (!this.sheets[url]) {
      this.sheets[url] = new Sheet(url);
    }
    return await this.sheets[url].getResponse();
  }
}

export const sheetManager = new SheetManager();
