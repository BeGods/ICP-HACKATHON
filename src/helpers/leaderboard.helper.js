export const timeRemainingForHourToFinishUTC = () => {
  const now = new Date();
  const utcMinutes = now.getUTCMinutes();
  const utcSeconds = now.getUTCSeconds();

  const remainingMinutes = 59 - utcMinutes;
  const remainingSeconds = 59 - utcSeconds;

  return {
    minutes: remainingMinutes <= 55 ? remainingMinutes : remainingMinutes,
    seconds: remainingSeconds,
  };
};

export const formatTwoNums = (num) => {
  if (num > 9) {
    return num.toString();
  }

  const updatedNo = "0" + num.toString();
  return updatedNo;
};

export const formatThreeNums = (num) => {
  if (num > 99) {
    return num.toString();
  }

  if (num < 10) {
    num = "00" + num.toString();
  } else if (num < 99) {
    num = "0" + num.toString();
  }
  return num;
};

export const formatRankOrbs = (num) => {
  if (num < 1000) {
    return num;
  }

  const numStr = num.toString();

  const thousands = numStr.slice(0, -3);
  let remainder = numStr.slice(-3);
  remainder = remainder.padStart(3, "0");

  if (remainder === "000") {
    return `${thousands} 0`;
  } else {
    return `${thousands} ${remainder}`;
  }
};
