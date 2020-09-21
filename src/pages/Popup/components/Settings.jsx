import React, { Component } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class Settings extends Component {

  constructor() {
    super();
    this.state = {
      selectedUser: 0,
      selectedMin: 0,
      selectedSec: 30,
      userDisabled: false,
      buttonDisabled: true,
    }
  }

  async componentDidMount() {
    var resp = await new Promise((resolve) => chrome.storage.sync.get(resolve));
    var data = resp['Defaults'];
    this.setState({
      selectedUser: data['Authuser'],
      selectedMin: data['BeforeMinutes'],
      selectedSec: data['BeforeSeconds']
    });
    console.log(this.state);
  }

  handleUserChange = async (event) => {
    this.setState({
      selectedUser: event.target.value,
      buttonDisabled: false,
    })
  }

  handleMinChange = async (event) => {
    this.setState({ selectedMin: event.target.value });
    this.checkInput();
  }

  handleSecChange = async (event) => {
    this.setState({ selectedSec: event.target.value });
    this.checkInput();
  }

  checkInput = () => {
    var Min = this.state.selectedMin;
    var Sec = this.state.selectedSec;
    if (!/[^0-9]/.test(Min) && Min != '' && !/[^0-9]/.test(Sec) && Sec != '') {
      this.setState({ buttonDisabled: false })
    } else {
      this.setState({ buttonDisabled: true })
    }
  }

  getList = (val) => {
    var list = []
    for (var i = 0; i <= val; i++) list.push(i);
    return list;
  }

  Save = async () => {
    console.log(this.state.selectedUser)
    var values = {
      'Authuser': this.state.selectedUser,
      'BeforeMinutes': parseInt(this.state.selectedMin),
      'BeforeSeconds': parseInt(this.state.selectedSec),
    };
    chrome.storage.sync.set({ 'Defaults': values }, function () {
      console.log('Updated Defaults settings to');
      console.log(values);
    });
    this.setState({ buttonDisabled: true })
  }

  render() {
    return (
      <div style={{ height: '300px' }}>
        <FormControl
          style={{ width: '90%', margin: '5%' }}
          disabled={this.state.userDisabled}
        >
          <InputLabel id="demo-controlled-open-select-label"> Auth User</InputLabel>
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
          <TextField style={{ width: '20%', marginLeft: '5%' }}
            id="standard-basic" label="Minutes"
            value={this.state.selectedMin}
            onChange={this.handleMinChange} />
          <TextField style={{ width: '20%', marginLeft: '5%' }}
            id="standard-basi" label="Seconds"
            value={this.state.selectedSec}
            onChange={this.handleSecChange} />
        </center>
        <center style={{ marginTop: '25px' }}>
          <Button
            id="submit_button"
            disabled={this.state.buttonDisabled}
            variant="contained"
            onClick={this.Save}
          >
            Save
          </Button>
        </center>
      </div>
    );
  }
}

export default Settings