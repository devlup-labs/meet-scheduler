import React, { Component } from 'react';

import AddAlarmForm from './components/AddAlarmForm';
import Alarmview from './components/Alarmview';
import AlarmUp from './components/AlarmUp';
import BottomNav from './components/BottomNav';
import Settings from './components/Settings';

import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';

import { getDataFromStorage } from './scripts/storage.js';

class Popup extends Component {
  constructor() {
    super();
    this.state = {
      tab: 0,
      checked: null,
    };
  }

  toggleChange = async () => {
    await this.setState({
      checked: !this.state.checked,
    });
    chrome.storage.sync.set({ extensionToggle: this.state.checked });
  };

  changeTab = (tab) => this.setState({ tab: tab });

  async componentDidMount() {
    var isToggled = await getDataFromStorage('extensionToggle');
    this.setState({
      checked: isToggled,
    });
  }

  render() {
    var pannel;
    if (this.state.tab == 0) pannel = <AddAlarmForm />;
    if (this.state.tab == 1) pannel = <Alarmview />;
    if (this.state.tab == 2) pannel = <AlarmUp />;
    if (this.state.tab == 3) pannel = <Settings />;
    return (
      <div>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={1}
        >
          <h1 style={{ marginRight: '10px' }}>Auto Join</h1>
          <Switch
            color="primary"
            name="checkedA"
            checked={this.state.checked}
            onChange={this.toggleChange}
            inputProps={{ 'aria-label': 'secondary checkbox' }}
          />
        </Grid>
        {pannel}
        <BottomNav data={this.changeTab} />
      </div>
    );
  }
}
export default Popup;
