function createTab(link, authuser, autojoin) {
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
            }
            console.log(`Status : ${info.status} and ID : ${tab.id}`);
          } else if (link.match(zoomregexExp)) {
            console.log('URL matched the zoom regex');
            if (autojoin) {
              console.log('Intiating autojoin');
              chrome.tabs.executeScript(tab.id, {});
              console.log(`Status : ${info.status} and ID : ${tab.id}`);
            }
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

function sendMessage(type, key) {
  let message = {};
  message['type'] = type;
  message['key'] = key;
  chrome.runtime.sendMessage(message, () => {});
}

export { createTab, sendMessage };
