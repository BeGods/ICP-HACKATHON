import { mythOrder } from "../utils/constants/variables";

export const filterAllQuests = (quests) => {
  try {
    const otherQuests = quests
      .filter((item) => item.mythology === "Other")
      .sort(
        (a, b) =>
          new Date(a?.createdAt).getTime() - new Date(b?.createdAt).getTime()
      );

    const mythologyQuests = quests
      .filter((item) => item.mythology !== "Other")
      .map((quest) => ({
        ...quest,
        isQuestClaimed:
          quest.isQuestClaimed !== undefined ? quest.isQuestClaimed : false,
      }));

    const completedQuests = mythologyQuests.filter(
      (item) => item.isQuestClaimed === true && !item.isKeyClaimed
    );
    const towerKeys = completedQuests.map((item) => {
      const indexes = Object.keys(item.requiredOrbs)
        .map((myth) => {
          const index = mythOrder.indexOf(myth);
          const count = item.requiredOrbs[myth];

          return index.toString().repeat(count);
        })
        .join("");

      return indexes;
    });

    return { otherQuests, mythologyQuests, towerKeys };
  } catch (error) {
    console.log("Filter quests", error);
  }
};
