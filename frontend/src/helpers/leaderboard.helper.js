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

// export const formatRankOrbs = (num) => {
//   if (num < 1000) {
//     return num.toString();
//   }

//   const numStr = num.toString();

//   const thousands = numStr.slice(0, -3); // before the last three digits
//   const remainder = numStr.slice(-3).replace(/^0+/, ""); // last three digits

//   return `${thousands},${remainder}`;
// };

export const formatRankOrbs = (num) => {
  if (num < 1000) {
    return num;
  }

  const numStr = num.toString();

  const thousands = numStr.slice(0, -3);
  let remainder = numStr.slice(-3);
  remainder = remainder.padStart(3, "0");

  if (remainder === "000") {
    return `${thousands},0`;
  } else {
    return `${thousands},${remainder}`;
  }
};
