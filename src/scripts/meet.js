var x = 1;
setInterval(function () {
  if(x > 30){
    console.log('Stopped');
    clearInterval(this);
    
  }
  else{
    x++;
  }
  try {
    let micButton = document.getElementsByClassName(
      'U26fgb JRY2Pb mUbCce kpROve uJNmj HNeRed QmxbVb'
    )[0];
    micButton.click();
    console.log('Clicked mic button');
  } catch (err) {
    console.log(err);
  }
  try {
    let camButton = document.getElementsByClassName(
      'U26fgb JRY2Pb mUbCce kpROve uJNmj HNeRed QmxbVb'
    )[0];
    camButton.click();
    console.log('Clicked cam button');
  } catch (err) {
    console.log(err);
  }
  try {
    let joinButton = document.getElementsByClassName(
      'uArJ5e UQuaGc Y5sE8d uyXBBb xKiqt'
    )[0];
    joinButton.click();
    console.log('Clicked join button');
  } catch (err) {
    console.log(err);
  }
  try {
    let join = document.getElementsByClassName(
      'U26fgb O0WRkf oG5Srb HQ8yf C0oVfc kHssdc HvOprf M9Bg4d'
    )[0];
    join.click();
    console.log('Clicked Join button');
  } catch (err) {
    console.log(err);
  }
}, 8000);
console.log('Joined the meeting!');
