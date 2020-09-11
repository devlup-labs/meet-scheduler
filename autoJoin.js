function autoJoin() {
    let micButton = document.getElementsByClassName("U26fgb JRY2Pb mUbCce kpROve uJNmj HNeRed QmxbVb")[0];
    micButton.click();
    console.log("Clicked mic button");

    let camButton = document.getElementsByClassName("U26fgb JRY2Pb mUbCce kpROve uJNmj HNeRed QmxbVb")[0];
    camButton.click();
    console.log("Clicked cam button");

    let joinButton = document.getElementsByClassName("uArJ5e UQuaGc Y5sE8d uyXBBb xKiqt")[0];
    joinButton.click();
    console.log("Clicked join button");
}

if( document.readyState !== 'loading' ) {
    console.log( 'Document is already ready, just execute code here' );
    autoJoin();
} else {
    document.addEventListener('DOMContentLoaded', function listner() {
        console.log( 'Document was not ready, place code here' );
        autoJoin();
        document.removeEventListener('DOMContentLoaded', listner);
    });
}
