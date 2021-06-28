import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import AlarmAddIcon from '@material-ui/icons/AlarmAdd';
import ClearIcon from '@material-ui/icons/Clear';

import { AddCustomAlarm } from '../scripts/alarm.js';

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
      selectedName: '',
      selectedLink: '',
      selectedTime: '',
      selectedEndTime: '',
      Linkerror: false,
      Dateerror: false,
      endDateerror: false,
      Nameerror: false,
      buttonDisabled: true,
      slots: [
        { count: 0, label: 'Once' },
        { count: 1, label: 'Daily' },
        { count: 7, label: 'Weekly' },
      ],
      selectedSlot: 0,
    };
  }

  handleNameChange = async (event) => {
    var val = event.target.value;
    var error = false;
    if (val === '') {
      error = true;
    }
    await this.setState({
      selectedName: val,
      Nameerror: error,
    });
    this.check();
  };

  handleLinkChange = async (event) => {
    var val = event.target.value;
    var error = false;
    if (
      (!val.match('https://meet.google.com/[a-zA-Z0-9?&=]+') &&
        !val.match('https://zoom.us/+')) ||
      val === ''
    ) {
      error = true;
    }
    await this.setState({
      selectedLink: val,
      Linkerror: error,
    });
    this.check();
  };

  handleTimeChange = async (event) => {
    var val = event.target.value;
    var startTime = new Date(val);
    var error = false;
    console.log(val, startTime);
    if (val === '' || startTime < new Date()) {
      error = true;
    }
    await this.setState({
      selectedTime: val,
      Dateerror: error,
    });
    if (this.state.selectedEndTime !== '') {
      var endTimeVal = new Date(this.state.selectedEndTime);
      if (startTime >= endTimeVal && !error) {
        this.setState({
          endDateerror: true,
        });
      } else {
        this.setState({
          endDateerror: false,
        });
      }
    }
    this.check();
  };

  handleEndTimeChange = async (event) => {
    var val = event.target.value;
    var endTimeVal = new Date(val);
    var startTime = new Date(this.state.selectedTime);
    var error = false;
    console.log(val, endTimeVal);
    if (val === '' || endTimeVal < new Date() || startTime >= endTimeVal) {
      error = true;
    }
    await this.setState({
      selectedEndTime: val,
      endDateerror: error,
    });
    this.check();
  };

  handleSlotChange = async (event) => {
    this.setState({ selectedSlot: event.target.value });
  };

  check = () => {
    if (
      !this.state.Linkerror &&
      !this.state.Dateerror &&
      !this.state.endDateerror &&
      !this.state.Nameerror &&
      this.state.selectedLink !== '' &&
      this.state.selectedTime !== '' &&
      this.state.selectedName !== ''
    ) {
      this.setState({ buttonDisabled: false });
    } else {
      this.setState({ buttonDisabled: true });
    }
  };

  ClearForm = () => {
    this.setState({
      selectedName: '',
      selectedLink: '',
      selectedTime: '',
      selectedEndTime: '',
      Linkerror: false,
      Dateerror: false,
      endDateerror: false,
      Nameerror: false,
      buttonDisabled: true,
    });
  };

  AddAlarm = async () => {
    var state = {
      Name: this.state.selectedName,
      Link: this.state.selectedLink,
      Time: this.state.selectedTime,
      EndTime: this.state.selectedEndTime,
      Repeat: this.state.selectedSlot,
    };
    await AddCustomAlarm(state);
    this.setState({
      selectedLink: '',
      selectedTime: '',
      selectedEndTime: '',
      selectedName: '',
      buttonDisabled: true,
      selectedSlot: 0,
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div style={{ height: '300px' }}>
        <TextField
          style={{ width: '90%', margin: '2% 4% 0 4%' }}
          value={this.state.selectedName}
          onChange={this.handleNameChange}
          id="Link"
          label="Name"
          type="text"
          error={this.state.Nameerror}
        />
        <TextField
          style={{ width: '90%', margin: '2% 4% 0 4%' }}
          value={this.state.selectedLink}
          onChange={this.handleLinkChange}
          id="Link"
          label="Meet Link"
          type="text"
          error={this.state.Linkerror}
        />
        <TextField
          style={{ width: '42%', margin: '2% 2% 2% 4%' }}
          value={this.state.selectedTime}
          onChange={this.handleTimeChange}
          id="date"
          label="Start Time"
          type="datetime-local"
          InputLabelProps={{
            shrink: true,
          }}
          error={this.state.Dateerror}
        />
        <TextField
          style={{ width: '42%', margin: '2% 4% 2% 2%' }}
          value={this.state.selectedEndTime}
          onChange={this.handleEndTimeChange}
          id="date"
          label="End Time"
          type="datetime-local"
          disabled={this.state.Dateerror || this.state.selectedTime === ''}
          InputLabelProps={{
            shrink: true,
          }}
          error={this.state.endDateerror}
        />
        <FormControl
          style={{ width: '90%', margin: '0 4%' }}
          disabled={this.state.slotDisabled}
        >
          <InputLabel id="demo-controlled-open-select-label">Repeat</InputLabel>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            value={this.state.selectedSlot}
            onChange={this.handleSlotChange}
          >
            {this.state.slots.map((item) => {
              return (
                <MenuItem key={item.count} value={item.count}>
                  {item.label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <center style={{ marginTop: '10px' }}>
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
