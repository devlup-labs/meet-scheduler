import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import ClearIcon from '@material-ui/icons/Clear';
import * as sheet from '../scripts/sheetapi.js';
import { AddAlarm_click } from '../scripts/alarm.js';
import { getAllDataFromStorage } from '../scripts/storage.js';

const useStyles = (theme) => ({
  button: {
    borderRadius: 30,
    margin: theme.spacing(2),
    background: '#3f51b5',
    color: 'white',
    '&:hover': {
      background: '#3f51b5',
      color: 'white',
    },
    '&:disabled': {
      background: '#E8EAF6',
      color: '#9fa8da',
    },
  },
  icon: {
    fill: 'black',
  },
});
class AddAlarmForm extends Component {
  constructor() {
    super();
    this.state = {
      courses: [],
      slots: [],
      existingAlarms: [],
      selectedSlot: '',
      selectedCourse: '',
      courseDisabled: true,
      slotDisabled: true,
      buttonDisabled: true,
      value: 0,
    };
  }

  handleSlotChange = async (event) => {
    this.setState({
      selectedSlot: event.target.value,
    });
    var courses = await sheet.get_courses(event.target.value);
    this.setState({
      courses: courses,
      courseDisabled: false,
    });
  };

  handleCourseChange = async (event) => {
    await this.setState({
      selectedCourse: event.target.value,
      buttonDisabled: false,
    });
  };

  getAlarmData = async () => {
    let data = await getAllDataFromStorage();
    if (data.length != 0) {
      var alarmAll = [];
      for (var key in data) {
        if (data[key].type == 'student') {
          var alarm = {
            key: key,
            code: data[key].course[0],
            course: data[key].course[1],
          };
          alarmAll.push(alarm);
        }
      }
    }
    this.setState({
      existingAlarms: alarmAll,
    });
  };

  AddAlarm = async () => {
    var classes = await sheet.get_classes(this.state.selectedSlot);
    var dataExist = this.state.existingAlarms.filter((alarm) => {
      return alarm['course'] == this.state.selectedCourse;
    });
    if (dataExist.length === 0) {
      AddAlarm_click(this.state.selectedCourse, classes);
      this.getAlarmData();
    } else {
      console.log('Data already exists');
    }
    this.setState({
      selectedSlot: '',
      selectedCourse: '',
      courseDisabled: true,
      buttonDisabled: true,
    });
  };

  ClearForm = () => {
    this.setState({
      selectedSlot: '',
      selectedCourse: '',
      courseDisabled: true,
      buttonDisabled: true,
    });
  };

  async componentDidMount() {
    var slots = await sheet.get_slots();
    this.getAlarmData();
    this.setState({
      slots: slots,
      slotDisabled: false,
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div style={{ height: '300px' }}>
        <FormControl
          style={{ width: '90%', margin: '5%' }}
          disabled={this.state.slotDisabled}
        >
          <InputLabel id="demo-controlled-open-select-label">Slot</InputLabel>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            value={this.state.selectedSlot}
            onChange={this.handleSlotChange}
          >
            {this.state.slots.map((item) => {
              return (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl
          style={{ width: '90%', margin: '5%' }}
          disabled={this.state.courseDisabled}
        >
          <InputLabel id="demo-controlled-open-select-label">Course</InputLabel>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            onChange={this.handleCourseChange}
            value={this.state.selectedCourse}
          >
            {this.state.courses.map((item) => {
              return (
                <MenuItem key={item} value={item}>
                  {item[1] + ' (' + item[4] + ')'}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <center style={{ marginTop: '15px' }}>
          <Button
            className={classes.button}
            id="submit_button"
            disabled={this.state.buttonDisabled}
            variant="contained"
            onClick={this.AddAlarm}
            endIcon={<AlarmAddIcon />}
          >
            Add Alarm
          </Button>
          <Button
            className={classes.button}
            id="clear_button"
            variant="contained"
            onClick={this.ClearForm}
            endIcon={<ClearIcon />}
          >
            Reset
          </Button>
        </center>
      </div>
    );
  }
}

export default withStyles(useStyles)(AddAlarmForm);
