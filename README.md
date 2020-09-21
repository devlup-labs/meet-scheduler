# Auto Join Google Meet

## Description

We are all fed up of keeping track of google meet links for our lectures. This chrome extension tries to make your life a bit easy!

## Tech stack

We've used React JS for frontend. Backend workflow is established using `chrome.storage` and `chrome.alarms`

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
