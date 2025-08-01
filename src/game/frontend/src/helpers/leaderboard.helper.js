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
  num = Math.floor(num);

  if (num >= 1000) {
    return (Math.floor(num / 100) / 10).toFixed(1) + "K";
  } else if (num >= 100) {
    return num.toString();
  } else if (num < 10) {
    return "00" + num.toString();
  } else if (num < 100) {
    return "0" + num.toString();
  }

  return num.toString();
};

export const formatRankOrbs = (num) => {
  if (num < 1000) {
    return num.toString();
  }

  const numStr = num.toString();
  const thousands = numStr.slice(0, -3);
  const remainder = numStr.slice(-3).padStart(3, "0");

  return `${thousands} ${remainder}`;
};
