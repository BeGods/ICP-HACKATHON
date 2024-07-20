import React, { useContext, useState } from "react";
import { MyContext } from "../context/context";
import { categorizeQuestsByMythology } from "../utils/categorizeQuests";
import { claimQuest, claimShareReward } from "../utils/api";

const mythologies = ["Celtic", "Egyptian", "Greek", "Norse"];

const Quests = () => {
  const { questsData, setQuestsData } = useContext(MyContext);
  const [activeMyth, setActiveMyth] = useState(0);

  const handleClaimShareReward = async (questId) => {
    const token = localStorage.getItem("accessToken");
    const questData = {
      questId: questId,
    };
    try {
      await claimShareReward(questData, token);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleClaimQuest = async (questId) => {
    const token = localStorage.getItem("accessToken");
    const questData = {
      questId: questId,
    };
    try {
      await claimQuest(questData, token);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-green-400">
      Quests
      <>
        <h1>
          {mythologies[activeMyth]}:{" "}
          {
            categorizeQuestsByMythology(questsData)[activeMyth][
              mythologies[activeMyth]
            ].sort((a, b) => a.isCompleted - b.isCompleted).length
          }
        </h1>
      </>
      <div className="flex gap-4 bg-yellow-300">
        <button
          onClick={() => {
            setActiveMyth((prev) => (prev - 1 + 4) % 4);
          }}
        >
          Prev
        </button>
        <button
          onClick={() => {
            setActiveMyth((prev) => (prev + 1) % 4);
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Quests;
