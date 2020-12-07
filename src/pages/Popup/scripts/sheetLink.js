class SheetLink {
  constructor(type, defaultURL, testFunc) {
    this.type = type;
    this.defaultURL = defaultURL;
    this.testFunc = testFunc;

    // set customURL from storage if exists
    this.customURL = undefined;
    this.isValidCustomURL = false;
  }

  async updateCustomURL(url) {
    try {
      let data = await fetch(url);
      if (this.testFunc(data)) {
        this.setCustomURL(url);
      } else {
        throw 'Wrong data in sheet';
      }
    } catch {
      throw 'Invalid URL';
    }
  }

  async setCustomURL(url) {
    this.customURL = url;
    this.isValidCustomURL = true;
    // set data into storage
  }

  setDefault() {
    this.isValidCustomURL = false;
  }

  getURL() {
    return this.isValidCustomURL ? this.customURL : this.defaultURL;
  }
}

export const timeTableSheet = new SheetLink(
  'time-table',
  'https://spreadsheets.google.com/feeds/cells/1rQt-pWpjvpc5A0G0VYs-Quf_JvnjSMio9PswuP-LOlQ/1/public/basic?alt=json',
  (data) => {
    // write checks here
    return true;
  }
);

export const slotSheet = new SheetLink(
  'slot-link',
  'https://spreadsheets.google.com/feeds/cells/1rQt-pWpjvpc5A0G0VYs-Quf_JvnjSMio9PswuP-LOlQ/2/public/basic?alt=json',
  (data) => {
    // write checks here
    return true;
  }
);
