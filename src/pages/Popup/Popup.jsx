import React, { Component } from 'react';
import SettingsIcon from '@material-ui/icons/Settings';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';

import AddAlarmForm from './components/AddAlarmForm';
import Alarmview from './components/Alarmview';
import AlarmUp from './components/AlarmUp';
import BottomNav from './components/BottomNav';
import Settings from './components/Settings';

class Popup extends Component {
  constructor() {
    super();
    this.state = {
      tab: 0,
      previousTab: 0,
    };
  }

  changeTab = (tab) => this.setState({
    previousTab: this.state.tab,
    tab: tab
  });

  render() {
    var pannel;
    if (this.state.tab == -1) pannel = <Settings />
    if (this.state.tab == 0) pannel = <AddAlarmForm />;
    if (this.state.tab == 1) pannel = <Alarmview />;
    if (this.state.tab == 2) pannel = <AlarmUp />;
    return (
      <div>
        <IconButton aria-label="Settings" style={{ position: 'absolute', right: '20px', marginTop: '-5px' }}
          onClick={() => this.changeTab((this.state.tab == -1) ? this.state.previousTab : -1)}>
          {(this.state.tab == -1) ? <ArrowBackIcon /> : <SettingsIcon />}
        </IconButton>
        <h1 style={{ textAlign: 'center' }}>Auto Join</h1>
        {pannel}
        <BottomNav data={this.changeTab} />
      </div>
    );
  }
}
export default Popup;
