import { mythologies } from "./variables";

export const categorizeQuestsByMythology = (quests) => {
  const categorizedQuests = mythologies.reduce((acc, mythology) => {
    acc[mythology] = [];
    return acc;
  }, {});

  quests.forEach((quest) => {
    const { mythology } = quest;
    if (categorizedQuests[mythology]) {
      categorizedQuests[mythology].push(quest);
    }
  });

  const categorizedQuestsArray = Object.keys(categorizedQuests).map(
    (mythology) => {
      return { [mythology]: categorizedQuests[mythology] };
    }
  );

  return categorizedQuestsArray;
};

export const handleActiveParts = (faith) => {
  const activeParts = [];
  for (let i = 0; i < faith; i++) {
    activeParts.push(i);
  }

  return activeParts;
};
