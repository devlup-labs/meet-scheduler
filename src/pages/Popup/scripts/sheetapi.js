import { sheetManager } from './fetchSheet';
import { timeTableSheet, slotSheet } from './sheetLink';

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

async function get_slots() {
  const link = await slotSheet.getURL();
  let resp = await sheetManager.getSheet(link);
  if (resp) {
    let data = resp.values;
    var formatteddata = {};
    for (var key in data) {
      if (!formatteddata[key]) {
        formatteddata[key] = [];
      }
      formatteddata[key] = data[key];
    }
    var result = {};
    for (var key in formatteddata) {
      if (!formatteddata[key][5] || formatteddata[key][5] == 'slot') continue;
      result[formatteddata[key][5]] = '';
    }
    return Object.keys(result);
  } else {
    alert('HTTP-Error: ' + response.status);
  }
}

//returns list of all the courses(detailed object) of a slot
async function get_courses(slot) {
  let link = await slotSheet.getURL();
  let resp = await sheetManager.getSheet(link);
  if (resp) {
    let data = resp.values;
    var formatteddata = {};
    for (var key in data) {
      if (!formatteddata[key]) {
        formatteddata[key] = [];
      }
      formatteddata[key] = data[key];
    }
    var result = [];
    for (var key in formatteddata) {
      if (formatteddata[key][5] == slot) {
        result.push(formatteddata[key]);
      }
    }
    return result;
  } else {
    alert('HTTP-Error: ' + response.status);
  }
}

//returns list of time slots of each day
async function get_classes(slot) {
  let link = await timeTableSheet.getURL();
  let resp = await sheetManager.getSheet(link);
  if (resp) {
    var data = resp.values;
    var formatteddata = {};
    for (var key in data) {
      if (!formatteddata[key]) {
        formatteddata[key] = [];
      }
      formatteddata[key] = data[key];
    }
    var cols = {
      0: 'Time',
      1: 'Monday',
      2: 'Monday',
      3: 'Tuesday',
      4: 'Tuesday',
      5: 'Wednesday',
      6: 'Wednesday',
      7: 'Thursday',
      8: 'Thursday',
      9: 'Friday',
      10: 'Friday',
      11: 'Saturday',
    };
    var classes = {};
    for (var key in formatteddata) {
      if (key == 0) {
        continue;
      }
      for (var col in formatteddata[key]) {
        if (formatteddata[key][col] == slot) {
          if (!classes[cols[col]]) {
            classes[cols[col]] = [];
          }
          classes[cols[col]].push(formatteddata[key][0]);
        }
      }
    }
    for (var key in classes) {
      for (var dkey in classes[key]) {
        var time = classes[key][dkey].split('-');
        var st = time[0].trim();
        var et = time[1].trim();
        classes[key][dkey] = { start: st, end: et };
      }
    }
    return classes;
  } else {
    alert('HTTP-Error: ' + response.status);
  }
}

//returns the meet_link given the course code
async function get_meetlink(course_code) {
  var link = await slotSheet.getURL();
  let resp = await sheetManager.getSheet(link);
  if (resp) {
    var data = resp.values;
    var formatteddata = {};
    for (var key in data) {
      if (!formatteddata[key]) {
        formatteddata[key] = [];
      }
      formatteddata[key] = data[key];
    }
    for (var key in formatteddata) {
      if (formatteddata[key][0] == course_code) return formatteddata[key][6];
    }
  }
}

export { get_slots, get_meetlink, get_classes, get_courses };
