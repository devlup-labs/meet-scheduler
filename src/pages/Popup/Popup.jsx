import React, { Component } from 'react';

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
    };
  }

  changeTab = (tab) => this.setState({ tab: tab });

  render() {
    var pannel;
    if (this.state.tab == 0) pannel = <AddAlarmForm />;
    if (this.state.tab == 1) pannel = <Alarmview />;
    if (this.state.tab == 2) pannel = <AlarmUp />;
    if (this.state.tab == 3) pannel = <Settings />;
    return (
      <div>
        <h1 style={{ textAlign: 'center' }}>Auto Join</h1>
        {pannel}
        <BottomNav data={this.changeTab} />
      </div>
    );
  }
}
export default Popup;
