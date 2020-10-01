import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import DeleteIcon from '@material-ui/icons/Delete';

import { RemoveAlarms } from '../scripts/alarm.js';
import { getAllDataFromStorage } from '../scripts/storage.js';

class Alarmview extends Component {
  constructor() {
    super();
    this.state = {
      alarms: [],
      alarmsWithKeys: {},
    };
  }

  async componentDidMount() {
    let data = await getAllDataFromStorage();
    if (data.length != 0) {
      var alarmAll = [];
      for (var key in data) {
        if (data[key].course.type == 'custom') {
          var alarm = {
            key: key,
            code: data[key].course.Name,
            course: 'custom',
          };
        } else {
          var alarm = {
            key: key,
            code: data[key].course['A'],
            course: data[key].course['B'],
          };
        }
        alarmAll.push(alarm);
      }
      var alarmCodeWise = {};
      var alarmCodeCourse = {};
      for (var key in alarmAll) {
        if (!alarmCodeWise[alarmAll[key].code])
          alarmCodeWise[alarmAll[key].code] = [];
        alarmCodeWise[alarmAll[key].code].push(alarmAll[key].key);
        alarmCodeCourse[alarmAll[key].code] = alarmAll[key].course;
      }
      var alarms = [];
      for (var key in alarmCodeCourse) {
        alarms.push({
          code: key,
          course: alarmCodeCourse[key],
        });
      }
      this.setState({
        alarms: alarms,
        alarmsWithKeys: alarmCodeWise,
      });
    }
  }

  trunc(string, num) {
    return string.length > num ? `${string.slice(0, num)}..` : string;
  }

  DeleteAlarm = (code) => {
    var newalarms = this.state.alarms;
    var index = 0;
    for (var i = 0; i < newalarms.length; i++) {
      if (newalarms[i].code === code) index = i;
    }
    if (index > -1) {
      newalarms.splice(index, 1);
    }
    this.setState({ alarms: newalarms });
    var alarmsKeyList = this.state.alarmsWithKeys[code];
    RemoveAlarms(alarmsKeyList);
  };

  render() {
    return (
      <div style={{ height: '348px', overflow: 'auto' }}>
        <List dense>
          {this.state.alarms.map((alarm) => {
            return (
              <ListItem key={alarm.code}>
                <ListItemIcon edge="start">
                  <AccessAlarmIcon style={{ color: 'black' }} />
                </ListItemIcon>
                <ListItemText
                  id={alarm.code}
                  primary={
                    alarm.course == 'custom'
                      ? `${this.trunc(alarm.code, 22)}`
                      : `${alarm.course}`
                  }
                  secondary={
                    alarm.course == 'custom'
                      ? `Custom User alarm`
                      : `${alarm.code}`
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => {
                      this.DeleteAlarm(alarm.code);
                    }}
                  >
                    <DeleteIcon style={{ fill: 'black' }} />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </div>
    );
  }
}

export default Alarmview;
