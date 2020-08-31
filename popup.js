var button  = document.getElementById("submit_button");
button.addEventListener('click', OpenLink)

var data = []
chrome.storage.sync.get(["Data"], function (res) {
    if (res.Data == undefined) {
        document.getElementById("data_list").innerHTML = "No data added";
    }
    if (res.Data.length > 0) {
        data = res.Data
        for (let i = 0; i < data.length; i++) {
            var node = document.createElement("LI");
            var list_data = `Link : ${data[i]["link"]}\nDescription : ${data[i]["description"]}\nTime : ${data[i]["startdata"]}`;
            var textnode = document.createTextNode(list_data);
            node.appendChild(textnode);
            document.getElementById("data_list").appendChild(node);
        }
    }
});

class UserData {
    constructor(link, description, startdata) {
        this.link  = link
        this.description = description
        this.startdata = new Date(startdata).toString()
        this.start_time = new Date(startdata).getTime()
    }
}

function OpenLink() {

    var link = document.getElementById("link").value;
    var description = document.getElementById("description").value;
    var startdata = document.getElementById("start_time").value;

    var alarm_data = new UserData(link, description, startdata)

    data.push(alarm_data)

    console.log(data)

    chrome.storage.sync.set({"Data" : data}, function () {
        console.log('Data is added');
    });

    chrome.storage.sync.get(["Data"], function (res) {
        data = res.Data
    });

    document.getElementById("link").value = "";
    document.getElementById("description").value = "";
    document.getElementById("start_time").value = "";
}
