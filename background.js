chrome.alarms.clearAll(function () {
    console.log("Clearing all alarms");
});


chrome.storage.sync.get(["Data"], function (res) {

    var data = res.Data
    console.log(`If condition data : ${ JSON.stringify(data) }`)

    for (let i = 0; i < data.length; i++) {
        const link = data[i]["link"];
        if (data[i]["start_time"] >= Date.now()) {
            chrome.alarms.create(data[i]["start_time"].toString(), {
                when : data[i]["start_time"]
            });
            console.log(`alarm ${ i } created`);
            chrome.alarms.onAlarm.addListener( function (alarm) {
                window.open(link, "_blank");
                chrome.alarms.clear(alarm["name"]);
            });
        };
    };

    chrome.alarms.getAll(function (alarms) {
        console.log(`Alarms : ${ JSON.stringify(alarms) }`)
    });

});