setInterval(function () {
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
}, 8000);
console.log('I am inserted');
