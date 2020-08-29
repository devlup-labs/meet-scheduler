var button  = document.getElementById("submit_button");
button.addEventListener('click', OpenLink)

var data = []

// retrive existing data 

chrome.storage.sync.get(["Data"], function (res) {
    if (res.Data.length > 0)
    data = res.Data
});


function OpenLink() {

    var url = document.getElementById("link").value;

    data.push(url)
    console.log(data)

    var startdata = document.getElementById("start_time").value;
    var start_time = new Date(startdata)

    // start_time.getTime() will give time in milliseconds

    chrome.alarms.create(startdata, {
        when : start_time.getTime()
    })

    chrome.alarms.onAlarm.addListener( function () {
        window.open(url, "_blank");
    })

    chrome.storage.sync.set({"Data" : data}, function () {
        console.log('Data is added');
    });

    chrome.storage.sync.get(["Data"], function (res) {
        data = res.Data
        document.getElementById("demo").innerHTML = JSON.stringify(res)
    });

    chrome.alarms.getAll(function (alarms) {
        console.log(`Alarms : ${ alarms }`)
    });
}
