// Credits: https://www.sitepoint.com/delay-sleep-pause-wait/
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const imagePath = 'assets/images/';

export {sleep, imagePath};