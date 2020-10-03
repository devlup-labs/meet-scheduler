import { storageHandler } from './storage';

class Series {
  constructor(code, slot, type) {
    this.code = code;
    this.slot = slot;
    this.type = type;
    this.occurence = {};
  }

  async init() {}

  async setAlarms() {}

  async update() {}
}

class SeriesManager {
  constructor() {
    this.seriesList = {};
    this.seriesMap = {};
    this.init();
  }

  async init() {
    let data = await storageHandler.get('chrome_sync', 'series-list');
    this.seriesList = data;
  }

  async updateStorage() {
    await storageHandler.set('chrome_sync', 'series-list', this.seriesList);
  }

  async get(series) {
    // check whether series is scheduled or not
    if (!(series in this.seriesList)) {
      throw "This is series isn't scheduled yet";
    }
    // if series is present in seriesMap then return it
    let seriesInfo = this.seriesList[series];

    if (series in this.seriesMap) {
      return this.seriesMap[series];
    }

    let obj = new Series(series, seriesInfo.slot, seriesInfo.type);
    await obj.init();
    this.seriesMap[series] = obj;
    return obj;
  }

  async set(series) {
    this.seriesList[series.code] = {
      slot: series.slot,
      type: series.type,
    };
    await this.updateStorage();

    let obj = this.get(series.code);
    obj.setAlarms();
  }

  async delete(series) {
    delete this.seriesList[series];
    await this.updateStorage();
  }

  async getAll() {
    let keys = Object.keys(this.seriesList);
    for (let i = 0; i < keys.length; i++) {
      this.get(keys[i]);
    }
    return this.seriesMap;
  }

  async updateAll() {
    let keys = Object.keys(this.seriesList);
    for (let i = 0; i < keys.length; i++) {
      let x = await this.get(keys[i]);
      x.update();
    }
  }
}

export const seriesManager = new SeriesManager();
