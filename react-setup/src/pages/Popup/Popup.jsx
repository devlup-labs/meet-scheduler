import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '90%',
    margin: theme.spacing(2),
  },
}));

let slots = [{ slot: 'A' }, { slot: 'B' }];
let slotA = [
  { title: 'Probability, Statistics and Stochastic process' },
  { title: 'Algorithm Design and Analysis' },
  { title: 'Bioinformatics & Computational Biology' },
];
let slotB = [
  { title: 'Analog Electronics' },
  { title: 'Artificial Intelligence' },
  { title: 'Signals and Systems' },
];

const Popup = () => {
  const classes = useStyles();
  const [selectedSlot, setSelectedSlot] = React.useState('');
  const [selectedCourse, setSelectedCourse] = React.useState('');
  const [courses, setCourses] = React.useState([]);
  const [disable, setDisable] = React.useState(true);

  const handleSlotChange = (event) => {
    setSelectedSlot(event.target.value);
    if (event.target.value === 'A') {
      setCourses(slotA);
      setDisable(false);
    }
    if (event.target.value === 'B') {
      setCourses(slotB);
      setDisable(false);
    }
  };

  const hanleCourseChange = (event) => {
    setSelectedCourse(event.target.value);
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Auto Join</h1>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-controlled-open-select-label">Age</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          onChange={handleSlotChange}
          value={selectedSlot}
        >
          {slots.map((item) => {
            return <MenuItem value={item.slot}>{item.slot}</MenuItem>;
          })}
        </Select>
      </FormControl>
      <FormControl className={classes.formControl} disabled={disable}>
        <InputLabel id="demo-controlled-open-select-label">Course</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          value={selectedCourse}
          onChange={hanleCourseChange}
        >
          {courses.map((item) => {
            return <MenuItem value={item.title}>{item.title}</MenuItem>;
          })}
        </Select>
      </FormControl>
      <h3 style={{ textAlign: 'center' }}>Slot : {selectedSlot}</h3>
      <h3 style={{ textAlign: 'center' }}>Course : {selectedCourse}</h3>
    </div>
  );
};

export default Popup;
