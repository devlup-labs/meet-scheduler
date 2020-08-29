var button  = document.getElementById("submit_button");
button.addEventListener('click', OpenLink)

var data = []

// retrive existing data 

chrome.storage.sync.get(["Data"], function (res) {
    if (res.Data.length > 0) {
        data = res.Data
        console.log(`If condition : ${ data }`)
    }
});


function OpenLink() {

    var url = document.getElementById("link").value;

    var startdata = document.getElementById("start_time").value;
    var start_time = new Date(startdata)

    var alarm_data = {"Link": url, "StartTime": start_time.getTime()}

    data.push(alarm_data)

    console.log(data)

    chrome.storage.sync.set({"Data" : data}, function () {
        console.log('Data is added');
    });

    chrome.storage.sync.get(["Data"], function (res) {
        data = res.Data
        document.getElementById("demo").innerHTML = JSON.stringify(res)
    });

}
