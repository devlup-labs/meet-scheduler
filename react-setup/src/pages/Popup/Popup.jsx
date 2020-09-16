import React, { Component } from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';

import * as sheet from './sheetapi.js';
import * as pop from './popup.js';

class Popup extends Component {

constructor() {
  super();
  this.state = {
    selectedSlot: "",
    selectedCourse: "",
    courses: [],
    slots: [],
    disabled: true,
    sldiabled: true,
  };
}

handleSlotChange = async (event) => {
  this.setState({
    disabled: true,
    selectedSlot: event.target.value,
  });
  var courses = await sheet.get_courses(event.target.value);
  this.setState({
  courses: courses,
  disabled: false
  });
}

handleCourseChange = (event) => {
  this.setState({
    selectedCourse: event.target.value,
  });
};

joinnow = async () => {
  var link = await sheet.get_meetlink(this.state.selectedCourse.A)
  var message = {type: 'joinnow', link: link};
  chrome.runtime.sendMessage(message, () => {})
}

AddAlarm = async () => {
  var classes = await sheet.get_classes(this.state.selectedSlot);
  pop.AddAlarm_click(this.state.selectedCourse, classes);
}

async componentDidMount() {
  var slots = await sheet.get_slots();
  this.setState({
    slots: slots,
    sldiabled: false
  });
};

render() { 
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Auto Join</h1>
      <FormControl style={{ width: '90%', margin: '5%' }} disabled={this.state.sldisabled}>
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
      <FormControl style={{ width: '90%', margin: '5%' }} disabled={this.state.disabled}>
        <InputLabel id="demo-controlled-open-select-label">Course</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          onChange={this.handleCourseChange}
        >
          {this.state.courses.map((item) => {
            return <MenuItem value={item}>{item.B+'('+item.E+')'}</MenuItem>;
          })}
        </Select>
      </FormControl>
      <h3 style={{ textAlign: 'center' }}>
        Slot : {this.state.selectedSlot}
        <span style={{ padding: '6px'}}></span>
        Course : {this.state.selectedCourse.A}
      </h3>
      <center>
      <Button style={{ marginTop: '15px'}}variant="contained" color="secondary" onClick={this.joinnow}>JOIN NOW</Button>
      <Button style={{ marginTop: '15px', marginLeft: '10px'}}variant="contained" onClick={this.AddAlarm}color="secondary">ADD Alarm</Button>
      </center>
  </div>
  );
};
}
export default Popup;
