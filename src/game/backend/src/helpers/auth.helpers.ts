export const getTokenExpiryMs = (expiry: string): number => {
  const timeUnit = expiry.slice(-1);
  const timeValue = parseInt(expiry.slice(0, -1));

  switch (timeUnit) {
    case "s":
      return timeValue * 1000;
    case "m":
      return timeValue * 60 * 1000;
    case "h":
      return timeValue * 60 * 60 * 1000;
    case "d":
      return timeValue * 24 * 60 * 60 * 1000;
    default:
      throw new Error("Invalid token expiry format");
  }
};

export const parseTimeToMs = (timeString: string) => {
  const match = timeString.match(/^(\d+)([smhd])$/);
  if (!match) {
    throw new Error(`Invalid time format: ${timeString}`);
  }

  const timeValue = parseInt(match[1]);
  const timeUnit = match[2];

  switch (timeUnit) {
    case "s":
      return timeValue * 1000; // Convert seconds to ms
    case "m":
      return timeValue * 60 * 1000; // Convert minutes to ms
    case "h":
      return timeValue * 60 * 60 * 1000; // Convert hours to ms
    case "d":
      return timeValue * 24 * 60 * 60 * 1000; // Convert days to ms
    default:
      throw new Error(`Unsupported time unit: ${timeUnit}`);
  }
};
