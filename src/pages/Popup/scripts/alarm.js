import { sendMessage } from './utils'
import { removeDataFromStorage, setDataIntoStorage } from './storage'

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
//nearest slot date object
class Alarm {
  constructor(course, startdata, enddata) {
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
    if (enddata !== '') {
      this.enddata = enddata.toString();
      this.endtime = enddata.getTime();
    }
    this.status = true;
  }
}

//returns <Date> the nearest date corresponding to data provided
//day : <string>, day to be found
//time: <string>, time to be found
async function get_nearestDate(day, time) {
  var resp = await new Promise((resolve) => chrome.storage.sync.get(resolve));
  var data = resp['Defaults'];
  var beforeminutes = data['BeforeMinutes'];
  var beforeseconds = data['BeforeSeconds'];
  var alarmHours = parseInt(time.split(':')[0]);
  var alarmMinutes = parseInt(time.split(':')[1]);
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
  if (diff < 0) diff = 7 + diff;
  if (diff == 0) {
    if (currentDate.getHours() > alarmHours) diff = 7;
    if (
      currentDate.getHours() == alarmHours &&
      currentDate.getMinutes() > alarmMinutes
    )
      diff = 7;
  }
  var numberOfDaysToAdd = diff;
  currentDate.setDate(currentDate.getDate() + numberOfDaysToAdd);
  currentDate.setHours(alarmHours);
  currentDate.setMinutes(alarmMinutes);
  currentDate.setSeconds(0);
  var settime = currentDate.getTime();
  settime = settime - (60 * beforeminutes + beforeseconds) * 1000;
  currentDate.setTime(settime);
  return currentDate;
}

//listens alarmadd button click on pop window
/*course: 
    {
    0: "PHL6020"
    1: "Classical Mechanics"
    2: "3"
    3: "3-0-0"
    4: "Monika Sinha"
    5: "B"
    6: "https://meet.google.com/lookup/gvaieffwcw?authuser=0&hs=179"
    }
*/

/*dates: 
    {
    Friday: Array(2)
    0: {start: "9:00", end: "9:25"}
    1: {start: "14:30", end: "14:55"} 
    }
*/
async function AddAlarm_click(course, dates) {
  for (var day in dates) {
    for (var i = 0; i < dates[day].length; i++) {
      course['time'] = dates[day][i];
      course['type'] = 'student';
      var start_time = dates[day][i]['start'];
      var start_date = await get_nearestDate(day, start_time);
      var alarm_data = new Alarm(course, start_date, '');
      setDataIntoStorage(alarm_data.id, alarm_data);
      sendMessage('ADD_ALARM', alarm_data.id);
    }
  }
}

async function AddCustomAlarm(alarm) {
  var resp = await new Promise((resolve) => chrome.storage.sync.get(resolve));
  var data = resp['Defaults'];
  var beforeminutes = data['BeforeMinutes'];
  var beforeseconds = data['BeforeSeconds'];
  var course = alarm;
  course['type'] = 'custom';
  var start_date = new Date(alarm.Time);
  var settime = start_date.getTime();
  settime = settime - (60 * beforeminutes + beforeseconds) * 1000;
  start_date.setTime(settime);
  var end_date = new Date(alarm.EndTime)
  alarm.Time = alarm.Time - (60 * beforeminutes + beforeseconds) * 1000;
  //once and weekly alarms
  if (course.Repeat == 0 || course.Repeat == 7) {
    var alarm_data = new Alarm(course, start_date, end_date);
    setDataIntoStorage(alarm_data.id, alarm_data);
    var time = { when: alarm_data.time }
    if (course.Repeat == 7) {
      console.debug('repeated weekely alarm')
      time['periodInMinutes'] = 10080
    }
    chrome.alarms.create(alarm_data.id, time);
  } else {
    //daily alarms
    for (var i = 0; i < 7; i++) {
      var alarm_data = new Alarm(course, start_date, end_date);
      setDataIntoStorage(alarm_data.id, alarm_data);
      start_date.setDate(start_date.getDate() + 1);
      end_date.setDate(end_date.getDate() + 1);
      console.log(start_date);
      var time = {
        when: alarm_data.time,
        periodInMinutes: 10080
      }
      chrome.alarms.create(alarm_data.id, time);;
    }
  }
}

export { AddAlarm_click, AddCustomAlarm, RemoveAlarms };
