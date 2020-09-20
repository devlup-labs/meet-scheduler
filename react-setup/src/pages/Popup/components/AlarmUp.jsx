import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import DeleteIcon from '@material-ui/icons/Delete';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import Avatar from '@material-ui/core/Avatar';

import { getAllDataFromStorage } from '../scripts/alarm.js';

class Alarmview extends Component {
  constructor () {
		super();
		this.state = {
			alarms: [],

		}
  }

	async componentDidMount (){
		let data = await getAllDataFromStorage();
    var alarms = await new Promise((resolve) => chrome.alarms.getAll(resolve));
    var setalarms = [];
    alarms.sort(function(a, b) { return a.scheduledTime - b.scheduledTime; });
    for (let i = 0; i < alarms.length; i++) {
      var time = new Date()
      time.setTime(alarms[i].scheduledTime)
      time = time.toLocaleString();
      setalarms.push({
        time: time,
        id: i,
        data: data[alarms[i].name].course
      });
    }
    this.setState({ alarms: setalarms });
	}

	render () {
		return (
		<div style={{ height: '300px',overflow: 'auto'}}>
      <List dense>
      {this.state.alarms.map((alarm) => {
        return (
          <ListItem key={alarm.id}>
            <ListItemIcon edge="start">
              <AccessTimeIcon style={{ color: 'black' }}/>
            </ListItemIcon>
            <ListItemText id={alarm.id} primary={`${alarm.data.A}`} secondary={`${alarm.time}`} />
            <ListItemSecondaryAction>
              <Avatar edge="end">
                {alarm.data.F}
              </Avatar>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
      </List>
		</div>
		)
	}
}

export default Alarmview