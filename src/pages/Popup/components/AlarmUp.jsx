import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';

import {
  getAllDataFromStorage,
  getDataFromStorage,
} from '../scripts/storage.js';
import { get_meetlink } from '../scripts/sheetapi.js';
import { createTab } from '../scripts/utils.js';

class Alarmview extends Component {
  constructor() {
    super();
    this.state = {
      listOfTodayAlarms: [],
      listOfLaterAlarms: [],
      listOfTomorrowAlarms: [],
      expanded: false,
    };
    this.accordion1Ref = React.createRef();
    this.accordion2Ref = React.createRef();
    this.accordion3Ref = React.createRef();
  }

  async componentDidMount() {
    let data = await getAllDataFromStorage();
    console.log(data);
    var alarms = await new Promise((resolve) => chrome.alarms.getAll(resolve));
    const todayAlarms = [];
    const tomorrowAlarms = [];
    const laterAlarms = [];
    let tomorrowAlarmsListCounter = 0;
    let todayAlarmsListCounter = 0;
    let laterAlarmsListCounter = 0;
    alarms.sort(function (a, b) {
      return a.scheduledTime - b.scheduledTime;
    });

    var time = new Date();
    let todayTime = new Date(time.getTime());
    let tomorrowTime = new Date(time.setDate(time.getDate() + 1));
    console.log(alarms);
    for (let i = 0; i < alarms.length; i++) {
      time.setTime(alarms[i].scheduledTime);
      console.log(todayTime.toLocaleDateString(), time.toLocaleString());
      // time = time.toLocaleString();
      // Checking for today
      if (time.toLocaleDateString() === todayTime.toLocaleDateString()) {
        todayAlarms.push({
          time: time.toLocaleString(),
          id: todayAlarmsListCounter,
          name: alarms[i].name,
          data: data[alarms[i].name].course,
          status: data[alarms[i].name].status,
          custom: data[alarms[i].name].course.type === 'custom',
          alarmDayCategoryList: 'listOfTodayAlarms',
        });
        todayAlarmsListCounter++;
      } else if (
        time.toLocaleDateString() === tomorrowTime.toLocaleDateString()
      ) {
        tomorrowAlarms.push({
          time: time.toLocaleString(),
          id: tomorrowAlarmsListCounter,
          name: alarms[i].name,
          data: data[alarms[i].name].course,
          status: data[alarms[i].name].status,
          custom: data[alarms[i].name].course.type === 'custom',
          alarmDayCategoryList: 'listOfTomorrowAlarms',
        });
        tomorrowAlarmsListCounter++;
      } else {
        laterAlarms.push({
          time: time.toLocaleString(),
          id: laterAlarmsListCounter,
          name: alarms[i].name,
          data: data[alarms[i].name].course,
          status: data[alarms[i].name].status,
          custom: data[alarms[i].name].course.type === 'custom',
          alarmDayCategoryList: 'listOfLaterAlarms',
        });
        laterAlarmsListCounter++;
      }
      // setalarms.push({
      //   time: time,
      //   id: i,
      //   name: alarms[i].name,
      //   data: data[alarms[i].name].course,
      //   status: data[alarms[i].name].status,
      //   custom: data[alarms[i].name].course.type === 'custom',
      // });
    }
    this.setState({
      listOfLaterAlarms: laterAlarms,
      listOfTomorrowAlarms: tomorrowAlarms,
      listOfTodayAlarms: todayAlarms,
    });
  }

  trunc(string, num) {
    return string.length > num ? `${string.slice(0, num)}..` : string;
  }

  updatestatus = async ({ alarm_id, alarmsList, alarmDayCategoryList }) => {
    var state = alarmsList;
    // console.log(alarmsList);
    state[alarm_id].status = !state[alarm_id].status;
    this.setState({ [alarmDayCategoryList]: state });
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
      link = data.Link;
    } else {
      link = await get_meetlink(data.A);
    }
    let details = await getDataFromStorage('Defaults');
    let tab = await createTab(link, details.Authuser, details.AutoJoin);
  };

  getname = (alarm) => {
    console.log(alarm);
    return alarm.custom ? `${alarm.data.Name}` : `${alarm.data.A}`;
  };
  checkHeightOfAccodion = (height) => {
    return {
      height: height > 147 ? '147px' : 'auto',
    };
  };
  getAlarmsList = (listOfAlarms) => {
    const {
      expanded,
      accordian1Height,
      accordion2Height,
      accordion3Height,
    } = this.state;
    let listStyle = null;

    if (expanded === 'panel1') {
      listStyle = this.checkHeightOfAccodion(accordian1Height);
    } else if (expanded === 'panel2') {
      listStyle = this.checkHeightOfAccodion(accordion2Height);
    } else {
      listStyle = this.checkHeightOfAccodion(accordion3Height);
    }

    return (
      <div className="alarmsList" style={{ ...listStyle, width: '100%' }}>
        <List dense>
          {listOfAlarms.map((alarm) => {
            return (
              <ListItem
                button
                focusRipple
                key={alarm.alarmDayCategoryList + alarm.id}
              >
                <Tooltip
                  placement="bottom-start"
                  TransitionComponent={Zoom}
                  title="Toggle Alarm"
                >
                  <ListItemIcon
                    edge="start"
                    onClick={() =>
                      this.updatestatus({
                        alarm_id: alarm.id,
                        alarmDayCategoryList: alarm.alarmDayCategoryList,
                        alarmsList: listOfAlarms,
                      })
                    }
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
                      primary={
                        alarm.custom
                          ? `${this.trunc(alarm.data.Name, 22)}`
                          : `${alarm.data.A} ${this.trunc(alarm.data.B, 13)}`
                      }
                      secondary={`${alarm.time}`}
                    />
                  </Tooltip>
                  <ListItemSecondaryAction>
                    <Avatar edge="end">
                      {alarm.custom ? <PersonAddIcon /> : alarm.data.F}
                    </Avatar>
                  </ListItemSecondaryAction>
                </Link>
              </ListItem>
            );
          })}
        </List>
      </div>
    );
  };

  handleChange = (panel) => (e, isExpanded) => {
    // console.log(
    //   this.accordion1Ref.current.clientHeight,
    //   this.accordion2Ref.current.clientHeight,
    //   this.accordion3Ref.current.clientHeight
    // );
    this.setState({
      expanded: isExpanded ? panel : false,
      accordian1Height: this.accordion1Ref.current.clientHeight,
      accordion2Height: this.accordion2Ref.current.clientHeight,
      accordion3Height: this.accordion3Ref.current.clientHeight,
    });
  };

  render() {
    const {
      listOfLaterAlarms,
      listOfTodayAlarms,
      listOfTomorrowAlarms,
      expanded,
      accordian1Height,
      accordion2Height,
      accordion3Height,
    } = this.state;

    return (
      <div
        className="alarmListWrapper"
        style={{ width: '100%', height: '348px' }}
      >
        <Accordion
          expanded={expanded === 'panel1'}
          onChange={this.handleChange('panel1')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            className="accordianSummary"
          >
            <Typography>Today</Typography>
          </AccordionSummary>
          <AccordionDetails
            className="accordianDetails"
            ref={this.accordion1Ref}
            style={{
              ...this.checkHeightOfAccodion(accordian1Height),
              paddingBottom: (accordian1Height > 147 && '0') || 'auto',
              overflow: 'auto',
            }}
          >
            {(listOfTodayAlarms.length > 0 &&
              this.getAlarmsList(listOfTodayAlarms)) || (
              <div
                style={{ padding: '1rem', textAlign: 'center', width: '100%' }}
              >
                <Typography>No alarms</Typography>
              </div>
            )}
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'panel2'}
          onChange={this.handleChange('panel2')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Tomorrow</Typography>
          </AccordionSummary>
          <AccordionDetails
            className="accordianDetails"
            ref={this.accordion2Ref}
            style={{
              ...this.checkHeightOfAccodion(accordion2Height),
              paddingBottom: (accordion2Height > 147 && '0') || 'auto',
              overflow: 'auto',
            }}
          >
            {(listOfTomorrowAlarms.length > 0 &&
              this.getAlarmsList(listOfTomorrowAlarms)) || (
              <div
                style={{ padding: '1rem', textAlign: 'center', width: '100%' }}
              >
                <Typography>No alarms</Typography>
              </div>
            )}
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'panel3'}
          onChange={this.handleChange('panel3')}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography>Later</Typography>
          </AccordionSummary>
          <AccordionDetails
            className="accordianDetails"
            ref={this.accordion3Ref}
            style={{
              ...this.checkHeightOfAccodion(accordion3Height),
              paddingBottom: (accordion3Height > 147 && '0') || 'auto',
              overflow: 'auto',
            }}
          >
            {(listOfLaterAlarms.length > 0 &&
              this.getAlarmsList(listOfLaterAlarms)) || (
              <div
                style={{ padding: '1rem', textAlign: 'center', width: '100%' }}
              >
                <Typography>No alarms</Typography>
              </div>
            )}
          </AccordionDetails>
        </Accordion>
      </div>
    );
  }
}

export default Alarmview;
