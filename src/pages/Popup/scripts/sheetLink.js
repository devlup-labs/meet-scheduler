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
  'https://spreadsheets.google.com/feeds/cells/1pEAMgjUp2eSSYmu__Szz6weCPsXd3Rtkv8MCnXT6rXw/od6/public/basic?alt=json',
  (data) => {
    // write cheks here
    return true;
  }
);

export const slotSheet = new SheetLink(
  'slot-link',
  'https://spreadsheets.google.com/feeds/cells/1CT8YGYORrT-DXoIC4rmmzfvCklcbpm3S-O0yS8OcIH0/od6/public/basic?alt=json',
  (data) => {
    // write checks here
    return true;
  }
);
