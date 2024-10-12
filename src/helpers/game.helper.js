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

export const handleGeneratePopTime = (counter) => {
  const currTime = Date.now();
  const downTime = currTime + handleGenerateCoolDown(counter);

  // Generate a random time within the next 1 minute (20s)
  const randomOffset = Math.floor(Math.random() * 20000);
  const randomTime = downTime + randomOffset;
  return randomTime;
};

export const formatRankOrbs = (num) => {
  if (num < 1000) {
    return num.toString();
  }

  const numStr = num.toString();

  const thousands = numStr.slice(0, -3); // before the last three digits
  const remainder = numStr.slice(-3).replace(/^0+/, ""); // last three digits

  return `${thousands},${remainder}`;
};
