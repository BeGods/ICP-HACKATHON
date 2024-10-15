export const timeRemainingForHourToFinishUTC = () => {
  const now = new Date(); // Current time
  const utcMinutes = now.getUTCMinutes();
  const utcSeconds = now.getUTCSeconds();

  const remainingMinutes = 59 - utcMinutes;
  const remainingSeconds = 59 - utcSeconds;

  return {
    minutes: remainingMinutes,
    seconds: remainingSeconds,
  };
};
