

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

export const extractBotName = (url) => {
  const cleanUrl = url.split("?")[0];
  const regex = /t\.me\/([^/]+)/;
  const match = cleanUrl.match(regex);
  return match ? `@${match[1]}` : url;
};

export const handleGeneratePopTime = (counter) => {
  const currTime = Date.now();
  const downTime = currTime + handleGenerateCoolDown(counter);

  // Generate a random time within the next 1 minute (20s)
  const randomOffset = Math.floor(Math.random() * 20000);
  const randomTime = downTime + randomOffset;
  return randomTime;
};

export const getPhaseByDate = (date = new Date()) => {
  const startDate = new Date(Date.UTC(2023, 0, 1)); // January 1, 2023 in UTC

  // Calculate the difference in days
  const diffInTime = date.getTime() - startDate.getTime();
  const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24));

  const phase = diffInDays % 5;

  return phase + 1;
};

export const formatDate = (givenDate) => {
  const date = new Date(givenDate);
  const options = { day: "2-digit", month: "long", year: "numeric" };
  const formattedDate = date.toLocaleDateString("en-GB", options);

  return formattedDate;
};


export const reformatPotion = (input) => {
  const mapping = {
    fire: "greek",
    water: "norse",
    air: "egyptian",
    earth: "celtic",
  };

  const parts = input.split(".");
  if (parts.length !== 3) return input;

  const [potion, element, code] = parts;
  const mythology = mapping[element];

  if (!mythology) return input;

  const newCode = code.replace("_", ".");
  return `${mythology}.${potion}.${newCode}`;
}

export const isCoin = (itemId) => {
  const starterCoin = /starter0[3-9]/?.test(itemId);
  const commonCoin = itemId?.includes("artifact.common01");
  const treasureCoin = itemId?.includes("artifact.treasure01");

  if (treasureCoin || starterCoin || commonCoin) {
    return true;
  }

  return false;
};

