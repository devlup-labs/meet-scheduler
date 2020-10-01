import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeIcon from '@material-ui/icons/Home';
import AlarmIcon from '@material-ui/icons/Alarm';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import SettingsIcon from '@material-ui/icons/Settings';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

export default function BottomNav(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        props.data(newValue);
        setValue(newValue);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction label="Home" icon={<HomeIcon />} />
      <BottomNavigationAction label="Alarms" icon={<AlarmIcon />} />
      <BottomNavigationAction label="Upcoming" icon={<AlarmOnIcon />} />
      <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
    </BottomNavigation>
  );
}
