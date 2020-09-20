import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import DeleteIcon from '@material-ui/icons/Delete';
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import ClearIcon from '@material-ui/icons/Clear';

import * as sheet from './sheetapi.js';
import { button_click, getAllDataFromStorage, removeDataFromStorage } from './popup.js';


const useStyles = (theme) => ({
  button : {
    borderRadius: 30,
    margin: theme.spacing(2),
    background: "#3f51b5",
    color: "white",
    "&:hover": {
      background: "#3f51b5",
      color: "white",
    }
  },
  icon: {
      fill: "black",
  },
});
class Popup extends Component {

constructor() {
  super();
  this.state = {
    courses: [],
    slots: [],
    alarms: [],
    selectedSlot: "",
    selectedCourse: "",
    courseDisabled: true,
    slotDisabled: true,
    buttonDisabled: true,
  };
}

updateList = async () => {
  var all_alarms = [];
  var data = await getAllDataFromStorage();
  for (var key in data){
    all_alarms.push(data[key]);
  }
  this.setState({
    alarms: all_alarms,
  });
}

handleSlotChange = async (event) => {
  this.setState({
    selectedSlot: event.target.value,
  });
  var courses = await sheet.get_courses(event.target.value);
  this.setState({
    courses: courses,
    courseDisabled: false
  });
}

handleCourseChange = (event) => {
  this.setState({
    selectedCourse: event.target.value,
    buttonDisabled: false,
  });
};

AddAlarm = async () => {
  button_click(this.state.selectedCourse);
  this.setState({
    selectedSlot: "",
    selectedCourse: "",
    courseDisabled: true,
    buttonDisabled: true,
  });
  this.updateList();
}

ClearForm = () => {
  this.setState({
    selectedSlot: "",
    selectedCourse: "",
    courseDisabled: true,
    buttonDisabled: true,
  });
}

DeleteAlarm = (key) => {
  return async () => {
    await removeDataFromStorage(key);
    this.updateList();
  };
};

joinnow = async () => {
  var link = await sheet.get_meetlink(this.state.selectedCourse.A)
  var message = {type: 'joinnow', link: link};
  chrome.runtime.sendMessage(message, () => {})
}

async componentDidMount() {
  this.updateList();
  var slots = await sheet.get_slots();
  this.setState({
    slots: slots,
    slotDisabled: false
  });
};

render() {
  const { classes } = this.props;
  return (
    <div>
      <h1 style={{ textAlign: 'center'}}>
        Auto Join
      </h1>
      <FormControl style={{ width: '90%', margin: '5%' }} disabled={this.state.slotDisabled}>
        <InputLabel id="demo-controlled-open-select-label">Slot</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          value={this.state.selectedSlot}
          onChange={this.handleSlotChange}
        >
          {this.state.slots.map((item) => {
            return <MenuItem value={item}>{item}</MenuItem>;
          })}
        </Select>
      </FormControl>
      <FormControl style={{ width: '90%', margin: '5%' }} disabled={this.state.courseDisabled}>
        <InputLabel id="demo-controlled-open-select-label">Course</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          onChange={this.handleCourseChange}
          value={this.state.selectedCourse}
        >
          {this.state.courses.map((item) => {
            return <MenuItem value={item}>{item.B +' ('+item.E+')'}</MenuItem>;
          })}
        </Select>
      </FormControl>
      <center>
      <Button
       className={classes.button}
       id="submit_button"
       disabled={this.state.buttonDisabled}
       variant="contained"
       onClick={this.AddAlarm}
       endIcon={<AlarmAddIcon/>}
      >
        Add Alarm
      </Button>
      <Button
       className={classes.button}
       id="clear_button"
       variant="contained"
       onClick={this.ClearForm}
       endIcon={<ClearIcon/>}
      >
        Clear
      </Button>
      </center>
      <List dense>
      {this.state.alarms.map((alarm) => {
        return (
          <ListItem key={alarm["id"]}>
            <ListItemIcon edge="start">
              <AccessAlarmIcon style={{ color: 'black' }}/>
            </ListItemIcon>
            <ListItemText id={alarm["desc"]["A"]} primary={`${alarm["desc"]["B"]}`} secondary={`${alarm["desc"]["A"]}`} />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label="delete" onClick={this.DeleteAlarm(alarm["id"])}>
                <DeleteIcon className={classes.icon} />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
      </List>
    </div>
  );
};
}
export default withStyles(useStyles)(Popup);
