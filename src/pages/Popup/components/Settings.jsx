/* eslint-disable react/jsx-no-duplicate-props */
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

import { setDataIntoStorage } from '../scripts/alarm.js';
import { NoEncryption } from '@material-ui/icons';

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
  },
});

class Settings extends Component {
  constructor() {
    super();
    this.state = {
      selectedUser: 0,
      selectedMin: 0,
      selectedSec: 30,
      selectedSwi: true,
      userDisabled: false,
      buttonDisabled: true,
      background: '#3f51b5',
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
    await this.setState({ selectedSwi: event.target.checked });
    this.setState({ buttonDisabled: false });
    this.setState({
      background: '#3f51b5',
    });
  };

  checkInput = () => {
    var Min = this.state.selectedMin.toString();
    var Sec = this.state.selectedSec.toString();
    if (!/[^0-9]/.test(Min) && Min != '' && !/[^0-9]/.test(Sec) && Sec != '') {
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
      AutoJoin: this.state.selectedSwi,
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
    await this.setState({ buttonDisabled: true, alarmData: Newresponse });
    await this.setState({
      background: '#E8EAF6',
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
      selectedSwi: data['AutoJoin'],
    });

    console.log(this.state);
  }

  render() {
    const { classes } = this.props;
    const styleobj = {
      background: this.state.background,
    };
    return (
      <div style={{ height: '300px' }}>
        <FormControl
          style={{ width: '90%', margin: '5%' }}
          disabled={this.state.userDisabled}
        >
          <InputLabel id="demo-controlled-open-select-label">
            {' '}
            Auth User
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
          <h4>Before Start Time</h4>
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
                checked={this.state.selectedSwi}
                onChange={this.handleSwiChange}
                color="primary"
              />
            }
            label="Auto Join"
          />
        </center>
        <center>
          <Button
            className={classes.button}
            id="submit_button"
            disabled={this.state.buttonDisabled}
            variant="contained"
            style={styleobj}
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
