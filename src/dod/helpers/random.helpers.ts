import { elemMythNames } from "../../utils/constants/variables";

export const generatRandomAvatar = () => {
  const avatarOpArr = [
    "celtic.char.C09_male",
    "celtic.char.C09_female",
    "egyptian.char.C09_male",
    "egyptian.char.C09_female",
    "greek.char.C09_male",
    "greek.char.C09_female",
    "norse.char.C09_male",
    "norse.char.C09_female",
  ];

  const randomIdx = Math.floor(Math.random() * avatarOpArr.length);

  return avatarOpArr[randomIdx];
};

// generates N random chars
export const getRandomChars = (pool, count) => {
  const arr = [...pool];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
};

// generates pool of all chars ( wexcluding avatars )
export const generatePool = (key) => {
  const mythologies = ["celtic", "egyptian", "greek", "norse"];
  const codes = [];

  ["A", "B"].forEach((prefix) => {
    for (let i = 1; i <= 9; i++) {
      codes.push(`${prefix}${String(i).padStart(2, "0")}`);
    }
  });

  //  <mythology>.char.<code>
  const pool = [];
  mythologies.forEach((myth) => {
    codes.forEach((code) => {
      pool.push(`${myth}.${key}.${code}`);
    });
  });

  return pool;
};

// generates pool of all chars ( wexcluding avatars )
export const generateArtifactsPool = (mythology) => {
  const categories = {
    common: 3, // 01–03
    starter: 10, // 01–10
  };

  const pool = [];

  Object.entries(categories).forEach(([category, max]) => {
    for (let i = 1; i <= max; i++) {
      const code = String(i).padStart(2, "0");
      pool.push(`${mythology}.artifact.${category}${code}.png`);
    }
  });

  return pool;
};

// generates pool of all chars ( wexcluding avatars & explore things )
export const generateDrawPool = (cardDeck, avatarType) => {
  const playerMyth = avatarType.split(".")[0];
  const mythElem = elemMythNames[playerMyth];
  const userCharDeck = cardDeck;
  const relics = userCharDeck
    .filter((c) => !c.cardId.includes("C09"))
    .map((c) => ({
      cardId: c.cardId.replace(".char.", ".relics."),
    }));
  const artifacts = generateArtifactsPool(playerMyth).map((id) => ({
    cardId: id,
  }));
  const quests = userCharDeck
    .filter((c) => !c.cardId.includes("C09"))
    .map((c) => ({ cardId: c.cardId.replace(".char.", ".quest.") }));

  let shards = [`shard.${mythElem}01`].map((id) => ({ cardId: id }));
  shards.push({ cardId: `shard.aether02` });

  let pool = [...userCharDeck, ...relics, ...quests, ...artifacts, ...shards];

  const excluded = [
    "artifact.common01",
    "artifact.common02",
    "artifact.starter02",
  ];
  pool = pool.filter((c) => !excluded.includes(c.cardId));

  return pool;
};

export const generateExplorePool = async (
  claimedItems: string[],
  avatarType: string
) => {
  const playerMyth = avatarType.split(".")[0];
  const mythElem = elemMythNames[playerMyth];

  // initial pool
  const pool = [
    // `${playerMyth}.artifact.common01`,
    `${playerMyth}.artifact.common02`,
    // `${playerMyth}.artifact.starter02`,
    // `${playerMyth}.char.C06`,
    // `${playerMyth}.char.C07`,
    // `${playerMyth}.char.C08`,
    // `shard.${mythElem}01`,
    // `shard.aether01`,
    // `shard.aether02`,
  ];

  const available = pool.filter((id) => !claimedItems.includes(id));

  if (available.length === 0) {
    return null;
  }

  const randomItem = available[Math.floor(Math.random() * available.length)];

  return randomItem;
};
