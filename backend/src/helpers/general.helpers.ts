export const areObjectsEqual = (obj1, obj2) => {
  const obj1Keys = Object.keys(obj1);

  for (let key of obj1Keys) {
    if (obj1[key] < obj2[key]) {
      return false;
    }
  }

  return true;
};

export const fourDigitCode = () => {
  const result = Math.floor(1000 + Math.random() * 9000);
  return result.toString();
};

export const threeDaysHaveElapsed = (date) => {
  const thereDaysFromDate = 3 * 24 * 60 * 60 * 1000;

  if (Date.now() < date + thereDaysFromDate) {
    return true;
  }

  return false;
};
