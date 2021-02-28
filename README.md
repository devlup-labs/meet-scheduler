[<img src="assets/chrome web store medium.png" alt="Meet Scheduler">](https://chrome.google.com/webstore/detail/auto-join-chrome-extensio/djlpjopjnkojimgiaefgbenbbkkknnln?hl=en)

We are all fed up of keeping track of google meet/ zoom links for our meetings. This chrome extension makes your life easy!
You just have to select the slot and the course (or add link and time in the `Custom` Tab) and this extension opens the link at the given time ( you can customize the start time ) and also lets you auto join it!😉

## Tech stack

React JS has been used for the frontend and the backend workflow is established using `chrome.storage` and `chrome.alarms`

## Description

<img src="assets/students form.png" alt="Students Form">
<img src="assets/custom form.png" alt="Custom Form">

- To add an alarm, select the slot and the course from the list and click on `Add Alarm` (IITJ Students)
- You can even add a custom link and time in the `Custom` tab
- The toggle on the top is a switch for the extension. If you turn it off, no alarms will ring.

<img src="assets/alarms.png" alt="Alarms List">
<img src="assets/upcoming alarms 2.png" alt="Upcoming Alarms">

- The `Alarm` tab shows a list of all the alarms

- The `Upcoming` tab shows you the upcoming alarms
  - If you want to uregently join the meeting, just click on the course code given in the list. It will take you to the meeting!
  - If you want to silent an alarm or don't want it to ring because of some reasons, click on the `tick mark` on the left to turn it off/on.

<img src="assets/settings.png" alt="Settings">

- The most important thing for the auto join feature to work is the `User Account` and the `Auto Join` toggle in the <b>Settings</b> tab
  <img src="assets/accounts.jpeg" alt="Accounts">

  - The image above shows some of the accounts a user might have registered in chrome. To use the <b>auto join</b> feature, the user must see the index of his/ her IITJ account (or whichever account they need to use to join the meeting) and select that number in the `User Account` dropdown list. Here, the index shown is 2 and therefore 2 is selected in the `User Account` dropdown list.
  - If the Auto Join switch is turned off in the Settings tab, alarm will ring and the link will get opened but it won't auto join the meeting for you.

- You can even customize the start time according to you. By default the start time is set to 30 seconds before the lecture time. One can change it to anything according to his/ her convenience.

#### If you want to contribute to this project:

## Steps to run locally

1. Make sure you have [Node.js](https://nodejs.org/en/download/) installed on your machine
1. Clone this repository `git clone https://github.com/devlup-labs/meet-scheduler.git`
1. Run `npm install` to install the dependencies
1. Run `npm start`
1. Load your extension on Chrome:
   1. Go to `chrome://extensions/`
   1. Turn on `Developer mode`
   1. Click on `Load unpacked extension`
   1. Select the `build` folder
