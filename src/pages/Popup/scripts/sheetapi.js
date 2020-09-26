import { sheetManager } from './fetchSheet';
import { timeTableSheet, slotSheet } from './sheetLink';

async function get_slots() {
  const link = await slotSheet.getURL();
  let resp = await sheetManager.getSheet(link);
  if (resp) {
    let data = resp.feed.entry;
    var formatteddata = {};
    for (var key in data) {
      var def = data[key].title.$t;
      if (!formatteddata[def.slice(1)]) {
        formatteddata[def.slice(1)] = {};
      }
      formatteddata[def.slice(1)][def[0]] = data[key].content.$t;
    }
    var result = {};
    for (var key in formatteddata) {
      if (!formatteddata[key]['F'] || formatteddata[key]['F'] == 'slot')
        continue;
      result[formatteddata[key]['F']] = '';
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
    let data = resp.feed.entry;
    var formatteddata = {};
    for (var key in data) {
      var def = data[key].title.$t;
      if (!formatteddata[def.slice(1)]) {
        formatteddata[def.slice(1)] = {};
      }
      formatteddata[def.slice(1)][def[0]] = data[key].content.$t;
    }
    var result = [];
    for (var key in formatteddata) {
      if (formatteddata[key]['F'] == slot) result.push(formatteddata[key]);
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
    var data = resp.feed.entry;
    var formatteddata = {};
    for (var key in data) {
      var def = data[key].title.$t;
      if (!formatteddata[def.slice(1)]) {
        formatteddata[def.slice(1)] = {};
      }
      formatteddata[def.slice(1)][def[0]] = data[key].content.$t;
    }
    var cols = {
      A: 'Time',
      B: 'Monday',
      D: 'Tuesday',
      F: 'Wednesday',
      H: 'Thursday',
      J: 'Friday',
      C: 'Monday',
      E: 'Tuesday',
      G: 'Wednesday',
      I: 'Thursday',
      K: 'Friday',
    };
    var classes = {};
    for (var key in formatteddata) {
      if (key == 2) {
        continue;
      }
      for (var col in formatteddata[key]) {
        if (formatteddata[key][col][0] == slot[0]) {
          if (!classes[cols[col]]) classes[cols[col]] = [];
          classes[cols[col]].push(formatteddata[key]['A']);
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
    var data = resp.feed.entry;
    var formatteddata = {};
    for (var key in data) {
      var def = data[key].title.$t;
      if (!formatteddata[def.slice(1)]) {
        formatteddata[def.slice(1)] = {};
      }
      formatteddata[def.slice(1)][def[0]] = data[key].content.$t;
    }
    for (var key in formatteddata) {
      if (formatteddata[key]['A'] == course_code)
        return formatteddata[key]['G'];
    }
  }
}

export { get_slots, get_meetlink, get_classes, get_courses };
