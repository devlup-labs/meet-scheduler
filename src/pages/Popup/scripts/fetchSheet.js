class Sheet {
  constructor(url) {
    this.url = url;
  }

  async getResponse() {
    // if sheet is older than 5 min then re fetch it
    const min = 5;
    if (!this.response || Date.now() - this.last_accessed > min * 60000) {
      await this.hardFetch();
    }
    else {
      console.debug("cache:: used sheet from cache")
    }
    return this.response;
  }

  async hardFetch() {
    var resp = await fetch(this.url);
    if (resp.ok) {
      this.response = resp.json();
      this.last_accessed = Date.now();
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
