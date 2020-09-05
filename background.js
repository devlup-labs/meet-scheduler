// Added listner to capture message
chrome.runtime.onMessage.addListener(
    function() {

        console.log("Message received from popup js");

        // Clear all alarms when new data is added
        chrome.alarms.clearAll(function () {
            console.log("Clearing all alarms");
        });


        // Fetching data and creating all the alarms again
        chrome.storage.sync.get(["Data"], function (res) {

            var data = res.Data;
            console.log(`Data stored : ${ JSON.stringify(data) }`);

            for (let i = 0; i < data.length; i++) {
                if (data[i]["start_time"] >= Date.now()) {
                    chrome.alarms.create(data[i]["id"], {
                        when : data[i]["start_time"]
                    });
                    console.log(`Alarm ${ i } created`);
                };
            };

            chrome.alarms.onAlarm.addListener( function (alarm) {
                var link = data.find(a => a.id === alarm["name"])["link"]
                console.log("Current link :" + link);
                window.open(link, "_blank");
                chrome.alarms.clear(alarm["name"]);
            });

            chrome.alarms.getAll(function (alarms) {
                console.log(`Alarms : ${ JSON.stringify(alarms) }`)
            });

        });
});