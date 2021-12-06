function createTab(link, authuser, autojoin, autoleave, endtime) {
  const gmeetregexExp = 'https://meet.google.com/[a-zA-Z0-9?&=]+';
  const zoomregexExp = 'https://zoom.us/+';
  if (link.match(gmeetregexExp)) {
    var link = link.split('?')[0];
    link = link + `?authuser=${authuser}&pli=1`;
  }
  if (link.match(zoomregexExp)) {
    var sp = link.split('/')[4];
    var code = sp.split('?')[0];
    link = `https://zoom.us/wc/${code}/join`;
  }
  console.log(`joining meeting ${link}`);
  return new Promise((resolve) => {
    chrome.tabs.create({ url: link }, async (tab) => {
      chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
        if (info.status === 'complete' && tabId === tab.id) {
          if (link.match(gmeetregexExp)) {
            console.log('URL matched the google meet regex');
            if (autojoin) {
              console.log('Intiating autojoin');
              chrome.tabs.executeScript(tab.id, { file: 'meet.bundle.js' });
            }
            console.log(`Status : ${info.status} and ID : ${tab.id}`);
            if (autoleave) {
              var endTime = new Date(endtime).getTime();
              var currentTime = new Date().getTime();
              var initiateAutoLeave = setTimeout(() => {
                console.log('Initiating auto leave');
                chrome.tabs.executeScript(tab.id, {
                  file: 'meetAutoLeave.bundle.js',
                });
              }, endTime - currentTime);
            }
          } else if (link.match(zoomregexExp)) {
            console.log('URL matched the zoom regex');
            if (autojoin) {
              console.log('Intiating autojoin');
              chrome.tabs.executeScript(tab.id, {});
              console.log(`Status : ${info.status} and ID : ${tab.id}`);
            }
          } else {
            console.log('URL did not match the regex');
          }

          chrome.tabs.onUpdated.removeListener(listener);
          resolve(tab);
        }
      });
    });
  });
}

function sendMessage(type, key) {
  let message = {};
  message['type'] = type;
  message['key'] = key;
  chrome.runtime.sendMessage(message, () => {});
}

export { createTab, sendMessage };
