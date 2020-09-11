setInterval(function() {
    let micButton = document.getElementsByClassName("U26fgb JRY2Pb mUbCce kpROve uJNmj HNeRed QmxbVb")[0];
    micButton.click();
    console.log("Clicked mic button");

    let camButton = document.getElementsByClassName("U26fgb JRY2Pb mUbCce kpROve uJNmj HNeRed QmxbVb")[0];
    camButton.click();
    console.log("Clicked cam button");

    let joinButton = document.getElementsByClassName("uArJ5e UQuaGc Y5sE8d uyXBBb xKiqt")[0];
    joinButton.click();
    console.log("Clicked join button");
}, 10000);

// setInterval is set to 10s as of now so that all the elements are rendered properly