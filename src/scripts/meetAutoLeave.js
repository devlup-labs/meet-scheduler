const autoLeave = () => {
  try {
    const leaveButton = document.getElementsByClassName(
      'VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ tWDL4c jh0Tpd Gt6sbf QQrMi'
    )[0];
    if (typeof leaveButton != 'undefined' && leaveButton != null) {
      leaveButton.click();
      console.log('Leave button clicked');
      console.log('Left the meeting');
    }
  } catch (err) {
    console.log(err);
  }
};

autoLeave();
