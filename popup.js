var button = document.getElementById("submit_button");
button.addEventListener("click", button_click);
update_list();

function sendMessage(type, key) {
  let message = {};
  message["type"] = type;
  message["key"] = key;
  chrome.runtime.sendMessage(message, () => {});
}

async function setDataIntoStorage(key, value) {
  const dict = {};
  dict[key] = value;
  return await new Promise((resolve) => {
    chrome.storage.sync.set(dict, resolve);
  });
}

async function getAllDataFromStorage() {
  return await new Promise((resolve) => {
    chrome.storage.sync.get(null, (result) => resolve(result || {}));
  });
}

async function removeDataFromStorage(key) {
  return await new Promise((resolve) => {
    chrome.storage.sync.remove(key, resolve);
  });
}

async function update_list() {
  let data = await getAllDataFromStorage();
  document.getElementById("data_list").innerHTML = "";
  if (data.length != 0) {
    for (var key in data) {
      var node = document.createElement("LI");

      var list_data = `Link : ${data[key].link}\nDescription : ${data[key].desc}\nTime : ${data[key].startdata}`;
      var textnode = document.createTextNode(list_data);
      node.appendChild(textnode);

      var button = document.createElement("button");
      button.innerHTML = "X";
      var fun = (key) => {
        return async () => {
          await removeDataFromStorage(key);
          update_list();
          sendMessage("REMOVE_ALARM", key);
        };
      };
      button.addEventListener("click", fun(key));

      node.appendChild(button);
      document.getElementById("data_list").appendChild(node);
    }
  } else {
    document.getElementById("data_list").innerHTML = "No data added";
  }
}

class Alarm {
  constructor(link, description, startdata) {
    this.generateID = function () {
      var dt = new Date().getTime();
      var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (dt + Math.random() * 16) % 16 | 0;
          dt = Math.floor(dt / 16);
          return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    };
    this.id = this.generateID();
    this.link = link;
    this.desc = description;
    this.startdata = new Date(startdata).toString();
    this.time = new Date(startdata).getTime();
  }
}

function button_click() {
  var link = document.getElementById("link").value;
  var description = document.getElementById("description").value;
  var startdata = document.getElementById("start_time").value;

  // check to validate data
  // TODO

  // create alarm
  var alarm_data = new Alarm(link, description, startdata);
  console.log(alarm_data);
  setDataIntoStorage(alarm_data.id, alarm_data);
  update_list();
  sendMessage("ADD_ALARM", alarm_data.id);

  document.getElementById("link").value = "";
  document.getElementById("description").value = "";
  document.getElementById("start_time").value = "";
}
