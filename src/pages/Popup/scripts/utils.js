function createTab(link, authuser, autojoin) {
    var link = link.split('?')[0];
    link = link + `?authuser=${authuser}&pli=1`;
    console.log(`joining meeting ${link}`);
    return new Promise((resolve) => {
        chrome.tabs.create({ url: link }, async (tab) => {
            chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                if (info.status === 'complete' && tabId === tab.id) {
                    const regexExp = 'https://meet.google.com/[a-zA-Z0-9?&=]+';
                    if (link.match(regexExp)) {
                        console.log('URL matched the regex');
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
    chrome.runtime.sendMessage(message, () => { });
}

export { createTab, sendMessage }