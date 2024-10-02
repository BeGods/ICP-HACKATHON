const handleGenerateCoolDown = (counter) => {
  if (counter === 0) {
    return 5000;
  } else if (counter === 1) {
    return 10000;
  } else if (counter === 2) {
    return 10000;
  } else if (counter >= 3 && counter < 12) {
    return 5000;
  } else if (counter >= 12) {
    return 5000;
  } else {
    return 10000;
  }
};
// generate random time in next 1 min
export const handleGeneratePopTime = (counter) => {
  const currTime = Date.now();
  const downTime = currTime + handleGenerateCoolDown(counter);

  // Generate a random time within the next 1 minute (60,000 ms)
  const randomOffset = Math.floor(Math.random() * 20000);
  const randomTime = downTime + randomOffset;
  return randomTime;
};
