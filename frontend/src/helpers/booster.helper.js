export const calculateRemainingTime = (card) => {
  const hoursInMs = 24 * 60 * 60 * 1000;
  const timeLeftInMs = card + hoursInMs - Date.now();

  let hoursLeft = Math.floor(timeLeftInMs / (1000 * 60 * 60));
  let minutesLeft = Math.floor((timeLeftInMs % (1000 * 60 * 60)) / (1000 * 60));

  // Add a leading zero if minutes are less than 10
  if (minutesLeft < 10) {
    minutesLeft = "0" + minutesLeft;
  }
  if (hoursLeft < 10) {
    hoursLeft = "0" + hoursLeft;
  }

  return hoursLeft + ":" + minutesLeft;
};

export const calculateMoonRemainingTime = (card) => {
  const hoursInMs = 4 * 24 * 60 * 60 * 1000;
  const timeLeftInMs = card + hoursInMs - Date.now();

  let hoursLeft = Math.floor(timeLeftInMs / (1000 * 60 * 60));
  let minutesLeft = Math.floor((timeLeftInMs % (1000 * 60 * 60)) / (1000 * 60));

  // Add a leading zero if minutes are less than 10
  if (minutesLeft < 10) {
    minutesLeft = "0" + minutesLeft;
  }
  if (hoursLeft < 10) {
    hoursLeft = "0" + hoursLeft;
  }

  return hoursLeft + ":" + minutesLeft;
};

export const hasTimeElapsed = (card) => {
  const timeLeftInMs = card + 24 * 60 * 60 * 1000 - Date.now();

  return timeLeftInMs <= 0;
};

export const isClaimedTodayUTC = (time) => {
  if (time === 0) {
    return false;
  }
  const now = new Date();
  const startOfTodayUTC = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );
  const endOfTodayUTC = startOfTodayUTC + 86400000;

  return time >= startOfTodayUTC && time < endOfTodayUTC;
};
