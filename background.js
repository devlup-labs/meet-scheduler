chrome.alarms.clearAll(function () {
    console.log("Clearing all alarms");
});

chrome.storage.sync.get(["Data"], function (res) {

    var data = res.Data
    console.log(`If condition data : ${ JSON.stringify(data) }`)

    for (let i = 0; i < data.length; i++) {
        if (data[i]["start_time"] >= Date.now()) {
            chrome.alarms.create(data[i]["id"], {
                when : data[i]["start_time"]
            });
            console.log(`alarm ${ i } created`);
        };
    };

    chrome.alarms.onAlarm.addListener( function (alarm) {
        var link = data.find(a => a.id === alarm["name"])["link"]
        window.open(link, "_blank");
        chrome.alarms.clear(alarm["name"]);
    });

    chrome.alarms.getAll(function (alarms) {
        console.log(`Alarms : ${ JSON.stringify(alarms) }`)
    });

});