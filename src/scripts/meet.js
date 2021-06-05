const autoJoin = () => {
  var initiateAutoJoin = setInterval(() => {
    try {
      var micButton = document.getElementsByClassName(
        'U26fgb JRY2Pb mUbCce kpROve uJNmj HNeRed QmxbVb'
      )[0];
      if (typeof micButton != 'undefined' && micButton != null) {
        micButton.click();
        console.log('Clicked mic button');
      }
    } catch (err) {
      console.log(err);
    }
    try {
      var camButton = document.getElementsByClassName(
        'U26fgb JRY2Pb mUbCce kpROve uJNmj HNeRed QmxbVb'
      )[0];
      if (typeof camButton != 'undefined' && camButton != null) {
        camButton.click();
        console.log('Clicked cam button');
      }
    } catch (err) {
      console.log(err);
    }
    try {
      var joinButton = document.getElementsByClassName(
        'uArJ5e UQuaGc Y5sE8d uyXBBb xKiqt'
      )[0];
      if (typeof joinButton != 'undefined' && joinButton != null) {
        joinButton.click();
        console.log('Clicked join button');
      }
    } catch (err) {
      console.log(err);
    }
    try {
      var joinRecording = document.getElementsByClassName(
        'U26fgb O0WRkf oG5Srb HQ8yf C0oVfc kHssdc HvOprf M9Bg4d'
      )[0];
      if (typeof joinRecording != 'undefined' && joinRecording != null) {
        joinRecording.click();
        console.log('Clicked join now button when recording');
      }
    } catch (err) {
      console.log(err);
    }
    if (!micButton && !camButton && !joinButton && !joinRecording) {
      console.log('Stopping Auto Join execution');
      clearInterval(initiateAutoJoin);
    }
  }, 10000);
  console.log('Joined the meeting!');
};

autoJoin();
