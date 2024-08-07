export const calculateRemainingTime = (card) => {
  const hoursInMs = 24 * 60 * 60 * 1000;
  const timeLeftInMs = card + hoursInMs - Date.now();

  const hoursLeft = Math.floor(timeLeftInMs / (1000 * 60 * 60));
  let minutesLeft = Math.floor((timeLeftInMs % (1000 * 60 * 60)) / (1000 * 60));

  // Add a leading zero if minutes are less than 10
  if (minutesLeft < 10) {
    minutesLeft = "0" + minutesLeft;
  }

  return hoursLeft + ":" + minutesLeft;
};
