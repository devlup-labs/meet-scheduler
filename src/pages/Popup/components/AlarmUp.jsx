import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import AlarmOffIcon from '@material-ui/icons/AlarmOff';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';

import { getAllDataFromStorage, getDataFromStorage } from '../scripts/storage.js';
import { get_meetlink } from '../scripts/sheetapi.js';
import { createTab } from '../scripts/utils.js';


class Alarmview extends Component {
  constructor() {
    super();
    this.state = {
      alarms: [],
    };
  }

  async componentDidMount() {
    let data = await getAllDataFromStorage();
    console.log(data);
    var alarms = await new Promise((resolve) => chrome.alarms.getAll(resolve));
    var setalarms = [];
    alarms.sort(function (a, b) {
      return a.scheduledTime - b.scheduledTime;
    });
    for (let i = 0; i < alarms.length; i++) {
      var time = new Date();
      time.setTime(alarms[i].scheduledTime);
      time = time.toLocaleString();
      setalarms.push({
        time: time,
        id: i,
        name: alarms[i].name,
        data: data[alarms[i].name].course,
        status: data[alarms[i].name].status,
        custom: data[alarms[i].name].course.type === 'custom'
      });
    }
    this.setState({ alarms: setalarms });
  }

  updatestatus = async (alarm_id) => {
    var state = this.state.alarms;
    state[alarm_id].status = !state[alarm_id].status;
    this.setState({ alarms: state });
    let data = await getAllDataFromStorage();
    var key = state[alarm_id].name;
    var val = data[state[alarm_id].name];
    val.status = state[alarm_id].status;
    var st = {};
    st[key] = val;
    chrome.storage.sync.set(st, () => {
      console.log('changed alarm status');
      console.log(st);
    });
  };

  joinnow = async (data) => {
    var link;
    if (data.type == 'custom') {
      link = data.Link
    } else {
      link = await get_meetlink(data.A);
    }
    let details = await getDataFromStorage('Defaults');
    let tab = await createTab(link, details.Authuser, details.AutoJoin);
  };

  getname = (alarm) => { console.log(alarm); return alarm.custom ? `${alarm.data.Name}` : `${alarm.data.A}` }

  render() {
    return (
      <div style={{ height: '348px', overflow: 'auto' }}>
        <List dense>
          {this.state.alarms.map((alarm) => {
            return (
              <ListItem button focusRipple key={alarm.id}>
                <Tooltip
                  placement="bottom-start"
                  TransitionComponent={Zoom}
                  title="Toggle Alarm"
                >
                  <ListItemIcon
                    edge="start"
                    onClick={() => this.updatestatus(alarm.id)}
                  >
                    {alarm.status ? (
                      <DoneIcon style={{ color: 'green' }} />
                    ) : (
                        <CloseIcon style={{ color: 'red' }} />
                      )}
                  </ListItemIcon>
                </Tooltip>
                <Link
                  onClick={() => this.joinnow(alarm.data)}
                  target="_blank"
                  rel="noopener"
                  underline="none"
                >
                  <Tooltip
                    placement="bottom-start"
                    TransitionComponent={Zoom}
                    title="Join now"
                  >
                    <ListItemText
                      id={alarm.id}
                      primary={alarm.custom ? `${alarm.data.Name}` : `${alarm.data.A}`}
                      secondary={`${alarm.time}`}
                    />
                  </Tooltip>
                  <ListItemSecondaryAction>
                    <Avatar edge="end">{alarm.custom ? <PersonAddIcon /> : alarm.data.F}</Avatar>
                  </ListItemSecondaryAction>
                </Link>
              </ListItem>
            );
          })}
        </List>
      </div>
    );
  }
}

export default Alarmview;
