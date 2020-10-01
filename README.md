[<img src="https://developer.chrome.com/webstore/images/ChromeWebStore_BadgeWBorder_v2_496x150.png">](https://chrome.google.com/webstore/detail/auto-join-chrome-extensio/djlpjopjnkojimgiaefgbenbbkkknnln?hl=en)

We are all fed up of keeping track of google meet links for our lectures. This chrome extension tries to make your life a bit easy!
You just have to select the slot and the course and this extension opens the link at the given time ( you can customize the start time ) and also lets you auto join it!

## Tech stack

React JS has been used for the frontend and the backend workflow is established using `chrome.storage` and `chrome.alarms`

## Description

![extension](https://user-images.githubusercontent.com/56914284/94225771-922b6380-ff13-11ea-8733-d9362716f82a.png)
![extension3](https://user-images.githubusercontent.com/56914284/94226000-18e04080-ff14-11ea-8b3f-ba17f7a8cc88.png)

- To add an alarm, select the slot and the course from the list and click on `Add Alarm`
  - You can even add a custom link and time in the `Custom` tab
- The toggle besides the heading is a switch for the extension. If you turn it off, no alarms will ring.

![upcoming](https://user-images.githubusercontent.com/56914284/94802096-a9cb8600-0404-11eb-9f15-843afc8f32ec.png)
![upcoming2](https://user-images.githubusercontent.com/56914284/94802106-ad5f0d00-0404-11eb-92e5-65cd306cb416.png)

- This tab shows you the upcoming alarms
  - If you want to uregently join the meeting, just click on the course code given in the list. It will take you to the meeting!
  - If you want to silent an alarm or don't want it to ring because of some reasons, click on the `tick mark` on the left to turn it off/on.

![extension4](https://user-images.githubusercontent.com/56914284/94226383-192d0b80-ff15-11ea-89bc-d709a6bedaa1.png)

- The most important thing for the auto join feature to work is the `Auth User` and the `Auto Join` toggle in the <b>Settings</b> tab

  ![accounts2](https://user-images.githubusercontent.com/56914284/94233534-aa0be300-ff25-11ea-96de-c153750028a0.jpeg)

  - The image shows some of the accounts a user might have registered in chrome. To use the <b>auto join</b> feature, the user must see the index of his/ her IITJ account and select that number in the `Auth User` dropdown list. Here, the index shown is 2 and therefore 2 is selected in the `Auth User` dropdown list.
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
