function sendMessage(type, key) {
  let message = {};
  message['type'] = type;
  message['key'] = key;
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

//called from popup to removes alarms associated to a particular course id
//alarmsKeyList : Array of alarms ids
async function RemoveAlarms(alarmsKeyList) {
  console.log(alarmsKeyList);
  for (let i = 0; i < alarmsKeyList.length; i++) {
    var key = alarmsKeyList[i];
    await removeDataFromStorage(key);
    sendMessage('REMOVE_ALARM', key);
  }
}

//createas a alarms object
//course: object containing course data
//nearst slot date object
class Alarm {
  constructor(course, startdata) {
    this.generateID = function () {
      var dt = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
          var r = (dt + Math.random() * 16) % 16 | 0;
          dt = Math.floor(dt / 16);
          return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
        }
      );
      return uuid;
    };
    this.id = this.generateID();
    this.course = course;
    this.startdata = startdata.toString();
    this.time = startdata.getTime();
  }
}

//returns <Date> the nearest date corrosponding to data provided
//day : <string>, day to be found
//time: <string>, time to be found
function get_nearestDate(day, time) {
  var alarmHours = parseInt(time.split(':')[0]);
  var alarmMinutes = parseInt(time.split(':')[1]) - 1;
  var currentDate = new Date();
  var days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  var alarmDay = days.indexOf(day);
  var currentDay = currentDate.getDay();
  var diff = alarmDay - currentDay;
  console.log(diff);
  if (diff < 0) diff = 7 + diff;
  if (diff == 0) {
    if (
      currentDate.getHours() > alarmHours &&
      currentDate.getMinutes() > alarmMinutes
    )
      diff = 7;
  }
  var numberOfDaysToAdd = diff;
  currentDate.setDate(currentDate.getDate() + numberOfDaysToAdd);
  currentDate.setHours(alarmHours);
  currentDate.setMinutes(alarmMinutes);
  currentDate.setSeconds(30);
  return currentDate;
}

//listens alarmadd button click on pop window
/*course: 
    {
    A: "PHL6020"
    B: "Classical Mechanics"
    C: "3"
    D: "3-0-0"
    E: "Monika Sinha"
    F: "B"
    G: "https://meet.google.com/lookup/gvaieffwcw?authuser=0&hs=179"
    }
*/
/*dates: 
    {
    Friday: Array(2)
    0: {start: "9:00", end: "9:25"}
    1: {start: "14:30", end: "14:55"} 
    }
*/
function AddAlarm_click(course, dates) {
  for (var day in dates) {
    for (var i = 0; i < dates[day].length; i++) {
      course['time'] = dates[day][i];
      var start_time = dates[day][i]['start'];
      var start_date = get_nearestDate(day, start_time);
      var alarm_data = new Alarm(course, start_date);
      setDataIntoStorage(alarm_data.id, alarm_data);
      sendMessage('ADD_ALARM', alarm_data.id);
    }
  }
}

export { AddAlarm_click, getAllDataFromStorage, RemoveAlarms };
