import { get_meetlink } from '../Popup/scripts/sheetapi.js';
import {
  getAllDataFromStorage,
  getDataFromStorage,
  setDataIntoStorage,
  removeDataFromStorage,
} from '../Popup/scripts/storage.js';
import { createTab } from '../Popup/scripts/utils.js';

async function onAlarm(alarm) {
  let extensionToggle = await getDataFromStorage('extensionToggle');
  let data = await getDataFromStorage(alarm.name);
  let details = await getDataFromStorage('Defaults');
  var ctime = new Date().getTime();
  if (extensionToggle && data.status && ctime - data.time < 5000) {
    console.log(`alarm::${alarm.name} initiated`);
    var link;
    if (data.course.type == 'custom') {
      link = data.course.Link;
    } else {
      link = await get_meetlink(data.course.A);
    }
    createTab(link, details.Authuser, details.AutoJoin);
  } else console.log(` passed by alarm::${alarm.name}`);
  if (alarm.periodInMinutes) {
    console.log(` resceduled alarm::${alarm.name} by ${alarm.periodInMinutes}`);
    var nextTime = alarm.scheduledTime + alarm.periodInMinutes * 60000;
    data.time = nextTime;
    data.status = true;
    setDataIntoStorage(alarm.name, data);
  } else {
    removeDataFromStorage(alarm.name);
  }
}

async function receiveMessage(request, sender, sendresponse) {
  // all request from extension
  sendresponse({ status: true });
  console.log(`message::key=${request.key}`);
  if (!sender.tab) {
    if (request.type == 'ADD_ALARM') {
      console.log('message::add alarm');
      // get data from storage
      let data = await getDataFromStorage(request.key);
      // create alarm
      chrome.alarms.create(request.key, {
        when: data.time,
        periodInMinutes: 10080,
      });
    } else if (request.type == 'REMOVE_ALARM') {
      console.log('message::alarm remove');
      // remove alarm
      await new Promise((resolve) => chrome.alarms.clear(request.key, resolve));
      // remove data from storage
    } else if (request.type == 'REMOVE_ALL_ALARM') {
      // clear all alarm
      await new Promise((resolve) => chrome.alarms.clearAll(resolve));
      // clear all storage
      await new Promise((resolve) => chrome.storage.sync.clear(resolve));
    } else {
      console.log('Message from popup.js');
      console.log(request);
    }
  } else {
    console.log('Message from tab');
  }
}

async function syncAlarms() {
  let data = await getAllDataFromStorage();
  // remove all alarms that are not in storage
  let alarms = await new Promise((resolve) => chrome.alarms.getAll(resolve));
  for (let i = 0; i < alarms.length; i++) {
    if (alarms[i].name in data) {
    } else {
      await new Promise((resolve) =>
        chrome.alarms.clear(alarms[i].name, resolve)
      );
      console.log(`alarm-sync::${alarms[i].name} alarm removed`);
    }
  }

  // set alarms that are in storage but not scheduled yet
  for (var key in data) {
    let alarm = await new Promise((resolve) => chrome.alarms.get(key, resolve));
    if (alarm == undefined) {
      console.log(`alarm-sync::${key} alarms scheduled weekly`);
      chrome.alarms.create(key, {
        when: data[key].time,
        periodInMinutes: 10080,
      });
    }
  }
}

async function onStart() {
  console.log('extension:started');
  console.log(`time::${Date.now()}`);
  var values = {
    Authuser: 0,
    BeforeMinutes: 0,
    BeforeSeconds: 30,
    AutoJoin: true,
  };
  let details = await getDataFromStorage('Defaults');
  if (!details) {
    chrome.storage.sync.set({ Defaults: values });
    console.log('Default values Added');
  }
  chrome.storage.sync.set({ extensionToggle: true }, () => {
    console.log('extension Toggled to true');
  });
  syncAlarms();
}

function onInstallation() {
  console.log('extension::installed');
  onStart();
}

// on install
chrome.runtime.onInstalled.addListener(onInstallation);

// on startup
chrome.runtime.onStartup.addListener(onStart);

// on alarm event listner
chrome.alarms.onAlarm.addListener(onAlarm);

// on message receive
chrome.runtime.onMessage.addListener(receiveMessage);
