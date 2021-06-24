import React, { Component } from 'react';

import CustomForm from './CustomForm';
import StudentForm from './StudentForm';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class AddAlarmForm extends Component {
  constructor() {
    super();
    this.state = {
      tab: 0,
    };
  }

  changeTab = (event, newValue) => {
    console.log(event);
    this.setState({ tab: newValue });
  };

  async componentDidMount() {}

  render() {
    var pannel;
    if (this.state.tab === 0) pannel = <CustomForm />;
    if (this.state.tab === 1) pannel = <StudentForm />;
    return (
      <div>
        <div>
          <Tabs
            value={this.state.tab}
            indicatorColor="primary"
            textColor="primary"
            onChange={(event, value) => {
              this.setState({ tab: value });
            }}
            aria-label="tabs"
            centered
          >
            <Tab label="Custom" />
            <Tab label="Student" />
          </Tabs>
        </div>
        {pannel}
      </div>
    );
  }
}
export default AddAlarmForm;
