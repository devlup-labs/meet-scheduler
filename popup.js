var button  = document.getElementById("submit_button");
button.addEventListener('click', OpenLink)

var data = []
chrome.storage.sync.get(["Data"], function (res) {
    if (res.Data === undefined) {
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

class AlarmData {
    constructor(link, description, startdata) {
        this.generateID = function () {
            var dt = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (dt + Math.random()*16)%16 | 0;
                dt = Math.floor(dt/16);
                return (c=='x' ? r :(r&0x3|0x8)).toString(16);
            });
            return uuid;
        }
        this.id = this.generateID()
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

    var alarm_data = new AlarmData(link, description, startdata)

    data.push(alarm_data)

    // Display all the data on the console
    console.log(data)

    // Add new data
    chrome.storage.sync.set({"Data" : data}, function () {
        console.log('Data is added');
    });

    // Send message to background script when new data is stored so as to update it
    chrome.runtime.sendMessage({greeting: "hello"}, function() {
        console.log("Message sent");
    });

    // Update the current data variable
    chrome.storage.sync.get(["Data"], function (res) {
        data = res.Data
    });  

    document.getElementById("link").value = "";
    document.getElementById("description").value = "";
    document.getElementById("start_time").value = "";
}
