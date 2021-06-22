import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import Switch from '@material-ui/core/Switch';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import SaveAltIcon from '@material-ui/icons/SaveAlt';

import { setDataIntoStorage } from '../scripts/storage.js';

const useStyles = (theme) => ({
  button: {
    borderRadius: 30,
    margin: theme.spacing(3),
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
});

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      selectedUser: 0,
      selectedMin: 0,
      selectedSec: 30,
      autoJoinCheck: true,
      autoLeaveCheck: true,
      userDisabled: false,
      buttonDisabled: true,
      alarmData: {},
    };
  }

  handleUserChange = async (event) => {
    this.setState({
      selectedUser: event.target.value,
      buttonDisabled: false,
    });
  };

  handleMinChange = async (event) => {
    await this.setState({ selectedMin: event.target.value });
    this.checkInput();
  };

  handleSecChange = async (event) => {
    await this.setState({ selectedSec: event.target.value });
    this.checkInput();
  };

  handleSwiChange = async (event) => {
    await this.setState({ autoJoinCheck: event.target.checked });
    this.setState({ buttonDisabled: false });
  };

  handleSwi2Change = async (event) => {
    await this.setState({ autoLeaveCheck: event.target.checked });
    this.setState({ buttonDisabled: false });
  };

  checkInput = () => {
    var Min = this.state.selectedMin.toString();
    var Sec = this.state.selectedSec.toString();
    if (
      !/[^0-9]/.test(Min) &&
      Min !== '' &&
      !/[^0-9]/.test(Sec) &&
      Sec !== ''
    ) {
      this.setState({ buttonDisabled: false });
    } else {
      this.setState({ buttonDisabled: true });
    }
  };

  getList = (val) => {
    var list = [];
    for (var i = 0; i <= val; i++) list.push(i);
    return list;
  };

  Save = async () => {
    // getting original time..
    var alarmArray = this.state.alarmData;
    for (var key in alarmArray) {
      if (key !== 'Defaults' && key !== 'extensionToggle') {
        alarmArray[key].time =
          alarmArray[key].time +
          alarmArray['Defaults']['BeforeMinutes'] * 60000 +
          alarmArray['Defaults']['BeforeSeconds'] * 1000;
      }
    }
    // new data set by user
    var values = {
      Authuser: this.state.selectedUser,
      BeforeMinutes: parseInt(this.state.selectedMin),
      BeforeSeconds: parseInt(this.state.selectedSec),
      AutoJoin: this.state.autoJoinCheck,
      AutoLeaveSwitch: this.state.autoLeaveCheck,
    };
    await chrome.storage.sync.set({ Defaults: values }, function () {
      console.log('Updated Defaults settings to');
      console.log(values);
    });
    var response = await new Promise((resolve) =>
      chrome.storage.sync.get(resolve)
    );
    await this.setState({
      alarmData: response,
    });
    for (var k in response) {
      if (k !== 'Defaults' && k !== 'extensionToggle') {
        response[k].time =
          alarmArray[k].time -
          response['Defaults']['BeforeMinutes'] * 60000 -
          response['Defaults']['BeforeSeconds'] * 1000;
        console.log('New time : ', response[k].time);
        setDataIntoStorage(response[k].id, response[k]);
        chrome.alarms.create(response[k].id, {
          when: response[k].time,
          periodInMinutes: 10080,
        });
      }
    }
    var Newresponse = await new Promise((resolve) =>
      chrome.storage.sync.get(resolve)
    );
    await this.setState({
      buttonDisabled: true,
      alarmData: Newresponse,
    });
  };

  async componentDidMount() {
    var resp = await new Promise((resolve) => chrome.storage.sync.get(resolve));
    var data = resp['Defaults'];
    this.setState({
      alarmData: resp,
      selectedUser: data['Authuser'],
      selectedMin: data['BeforeMinutes'],
      selectedSec: data['BeforeSeconds'],
      autoJoinCheck: data['AutoJoin'],
      autoLeaveCheck: data['AutoLeaveSwitch'],
    });

    console.log(this.state);
  }

  render() {
    const { classes } = this.props;
    return (
      <div style={{ height: '348px' }}>
        <FormControl
          style={{ width: '90%', margin: '5%' }}
          disabled={this.state.userDisabled}
        >
          <InputLabel id="demo-controlled-open-select-label">
            {' '}
            User Account
          </InputLabel>
          <Select
            labelId="demo-controlled-open-select-label"
            id="demo-controlled-open-select"
            value={this.state.selectedUser}
            onChange={this.handleUserChange}
          >
            {this.getList(10).map((item) => {
              return <MenuItem value={item}>{item}</MenuItem>;
            })}
          </Select>
        </FormControl>
        <center>
          <h4>Join Before Start Time</h4>
          <TextField
            style={{ width: '20%', marginLeft: '5%' }}
            id="standard-basic"
            label="Minutes"
            value={this.state.selectedMin}
            onChange={this.handleMinChange}
          />
          <TextField
            style={{ width: '20%', marginLeft: '5%' }}
            id="standard-basi"
            label="Seconds"
            value={this.state.selectedSec}
            onChange={this.handleSecChange}
          />
          <br />
          <FormControlLabel
            style={{ marginTop: '20px' }}
            control={
              <Switch
                checked={this.state.autoJoinCheck}
                onChange={this.handleSwiChange}
                color="primary"
              />
            }
            label="Auto Join"
          />
          <FormControlLabel
            style={{ marginTop: '20px' }}
            control={
              <Switch
                checked={this.state.autoLeaveCheck}
                onChange={this.handleSwi2Change}
                color="primary"
              />
            }
            label="Auto Leave"
          />
        </center>
        <center>
          <Button
            className={classes.button}
            id="submit_button"
            disabled={this.state.buttonDisabled}
            variant="contained"
            onClick={this.Save}
            endIcon={<SaveAltIcon />}
          >
            Save
          </Button>
        </center>
      </div>
    );
  }
}

export default withStyles(useStyles)(Settings);
