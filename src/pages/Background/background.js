import { get_meetlink } from '../Popup/scripts/sheetapi.js';

function createTab(link) {
  var link = link.split('?')[0];
  link = link + '?authuser=0&pil=1';
  return new Promise((resolve) => {
    chrome.tabs.create({ url: link }, async (tab) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (info.status === 'complete' && tabId === tab.id) {
          const regexExp = 'https://meet.google.com/[a-zA-Z0-9?&=]+';
          if (link.match(regexExp)) {
            console.log('URL matched the regex');

            chrome.tabs.executeScript(tab.id, {
              code: `
                        setInterval(function() {

                        try{
                          let micButton = document.getElementsByClassName("U26fgb JRY2Pb mUbCce kpROve uJNmj HNeRed QmxbVb")[0];
                          micButton.click();
                          console.log("Clicked mic button");
                        } catch (err) { console.log(err); }
                        try{
                          let camButton = document.getElementsByClassName("U26fgb JRY2Pb mUbCce kpROve uJNmj HNeRed QmxbVb")[0];
                          camButton.click();
                          console.log("Clicked cam button");
                        } catch (err) { console.log(err); }
                        try{
                          let joinButton = document.getElementsByClassName("uArJ5e UQuaGc Y5sE8d uyXBBb xKiqt")[0];
                          joinButton.click();
                          console.log("Clicked join button");
                        } catch (err) {console.log(err);}
                        }, 8000);
                        `,
            });

            console.log(`Status : ${info.status} and ID : ${tab.id}`);
          } else {
            console.log('URL did not mtach the regex');
          }

          chrome.tabs.onUpdated.removeListener(listener);
          resolve(tab);
        }
      });
    });
  });
}

async function onAlarm(alarm) {
  console.log(`alarm::${alarm.name}`);
  let data = await getDataFromStorage(alarm.name);
  console.log(data);
  let link = await get_meetlink(data.course['A']);
  let tab = await createTab(link);
}

async function getAllDataFromStorage() {
  return await new Promise((resolve) => {
    chrome.storage.sync.get(null, (result) => resolve(result || {}));
  });
}

async function getDataFromStorage(key) {
  return await new Promise((resolve) => {
    chrome.storage.sync.get(key, (result) => resolve(result[key]));
  });
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
      await new Promise23();
      2((resolve) => chrome.alarms.clearAll(resolve));
      // clear all storage
      await new Promise((resolve) => chrome.storage.sync.clear(resolve));
    }
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

function onStart() {
  console.log('extension:started');
  console.log(`time::${Date.now()}`);
  var values = {
    'Authuser': 0,
    'BeforeMinutes': 0,
    'BeforeSeconds': 30,
  };
  chrome.storage.sync.set({ 'Defaults': values });
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
