import { storageHandler } from './storage';
import { timeTableChecker, slotChecker } from './checkers';

class SheetLink {
  constructor(type, defaultURL, testFunc) {
    this.type = type;
    this.defaultURL = defaultURL;
    this.testFunc = testFunc;

    this.customURL = undefined;
    this.isValidCustomURL = false;

    this.init();
  }

  async init() {
    let link = await storageHandler.get('chrome_sync', this.type);
    if (link) {
      this.customURL = link;
      this.isValidCustomURL = true;
    }
  }

  async updateCustomURL(url) {
    let status = await this.isValidURL(url);
    if (status) {
      await this.setCustomURL(url);
    } else {
      throw 'Invaild URL';
    }
  }

  async isValidURL(url) {
    try {
      let data = await fetch(url);
      if (this.testFunc(data)) {
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }

  async setCustomURL(url) {
    this.customURL = url;
    this.isValidCustomURL = true;
    storageHandler.set('chrome_sync', this.type, url);
  }

  setDefault() {
    this.isValidCustomURL = false;
    this.customURL = undefined;
    storageHandler.remove('chrome_sync', this.type);
  }

  getURL() {
    return this.isValidCustomURL ? this.customURL : this.defaultURL;
  }
}

const timeTableDefaultLink =
  'https://spreadsheets.google.com/feeds/cells/1pEAMgjUp2eSSYmu__Szz6weCPsXd3Rtkv8MCnXT6rXw/od6/public/basic?alt=json';

export const timeTableSheet = new SheetLink(
  'time-table',
  timeTableDefaultLink,
  timeTableChecker
);

const slotDefaultLink =
  'https://spreadsheets.google.com/feeds/cells/1CT8YGYORrT-DXoIC4rmmzfvCklcbpm3S-O0yS8OcIH0/od6/public/basic?alt=json';

export const slotSheet = new SheetLink(
  'slot-link',
  slotDefaultLink,
  slotChecker
);
