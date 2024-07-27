const mythologies = ["Celtic", "Egyptian", "Greek", "Norse"];

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

  const categorizedQuestsArray = Object.keys(categorizedQuests)
    .sort()
    .map((mythology) => {
      return { [mythology]: categorizedQuests[mythology] };
    });

  console.log(categorizedQuestsArray);

  return categorizedQuestsArray;
};
