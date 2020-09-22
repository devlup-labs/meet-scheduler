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
  icon: {
    fill: 'black',
  },
});
class AddAlarmForm extends Component {
  constructor() {
    super();
    this.state = {
      selectedLink: '',
      Linkerror: false,
      Dateerror: false,
      selectedTime: '',
      buttonDisabled: true,
      slots: [
        { 'count': 0, 'label': 'Once' },
        { 'count': 1, 'label': 'Daily' },
        { 'count': 7, 'label': 'Weekly' }
      ],
      selectedSlot: 0
    };
  }

  handleLinkChange = async (event) => {
    var val = event.target.value;
    var error = false;
    if (!val.match('https://meet.google.com/[a-zA-Z0-9?&=]+') || val == '') {
      error = true;
    }
    await this.setState({
      selectedLink: val,
      Linkerror: error
    })
    this.check();
  };

  handleTimeChange = async (event) => {
    var val = event.target.value;
    var error = false;
    if (val == '') {
      error = true;
    }
    await this.setState({
      selectedTime: val,
      Dateerror: error
    })
    this.check();
  };

  handleSlotChange = async (event) => {
    this.setState({ selectedSlot: event.target.value })
  }

  check = () => {
    if (!this.state.Linkerror && !this.state.Dateerror &&
      this.state.selectedLink != '' && this.state.selectedTime != '') {
      this.setState({ buttonDisabled: false });
    } else {
      this.setState({ buttonDisabled: true });
    }
  }

  ClearForm = () => {
    this.setState({
      selectedLink: '',
      selectedTime: '',
      buttonDisabled: true,
    });
  };

  async componentDidMount() {
  }

  render() {
    const { classes } = this.props;
    return (
      <div style={{ height: '300px' }}>
        <TextField
          style={{ width: '90%', margin: '4%' }}
          value={this.state.selectedLink}
          onChange={this.handleLinkChange}
          id="Link"
          label="Meet link"
          type="text"
          error={this.state.Linkerror}
        />
        <TextField
          style={{ width: '90%', margin: '4%' }}
          value={this.state.selectedTime}
          onChange={this.handleTimeChange}
          id="date"
          label="Meet Date"
          type="datetime-local"
          InputLabelProps={{
            shrink: true,
          }}
          error={this.state.Dateerror}
        />
        <FormControl
          style={{ width: '90%', margin: '4%' }}
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
              return <MenuItem key={item.count} value={item.count}>{item.label}</MenuItem>;
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
