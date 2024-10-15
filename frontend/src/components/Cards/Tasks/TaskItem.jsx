import React, { useContext, useRef, useState } from "react";
import { Check, ChevronRight, Download } from "lucide-react";
import { showToast } from "../../Toast/Toast";
import { MyContext } from "../../../context/context";
import { claimSocialTask } from "../../../utils/api";

const tele = window.Telegram?.WebApp;

const TaskItem = ({ quest }) => {
  const [isClicked, setIsClicked] = useState(false);
  const { authToken, socialQuestData, setSocialQuestData, setGameData } =
    useContext(MyContext);
  const [claim, setClaim] = useState(false);
  const disableClick = useRef(false);

  const handleClaimTask = async () => {
    if (disableClick.current === false) {
      disableClick.current = true;
      setTimeout(() => {
        disableClick.current = false;
      }, 2000);
      try {
        await claimSocialTask({ questId: quest._id }, authToken);
        const updatedQuestData = socialQuestData.map((item) =>
          item._id === quest._id ? { ...item, isCompleted: true } : item
        );
        const updatedGameData = {
          ...gameData,
          multiColorOrbs:
            gameData.multiColorOrbs + quest.requiredOrbs.multiOrbs,
        };
        setGameData(updatedGameData);
        setSocialQuestData(updatedQuestData);
        showToast("task_success");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred";
        console.log(errorMessage);
        showToast("task_error");
      }
    }
  };

  return (
    <div
      onClick={() => {
        tele.HapticFeedback.notificationOccurred("success");

        if (!quest.isCompleted && claim === false) {
          window.open(quest?.link, "_blank");
          setClaim(true);
        } else if (!quest.isCompleted && claim === true) {
          handleClaimTask();
        }
      }}
      className={`flex gap-1 border 
${
  isClicked ? `glow-button-white` : ""
} rounded-primary h-[90px] w-full bg-glass-black p-[15px] `}
      onMouseDown={() => {
        setIsClicked(true);
      }}
      onMouseUp={() => {
        setIsClicked(false);
      }}
      onMouseLeave={() => {
        setIsClicked(false);
      }}
      onTouchStart={() => {
        setIsClicked(true);
      }}
      onTouchEnd={() => {
        setIsClicked(false);
      }}
      onTouchCancel={() => {
        setIsClicked(false);
      }}
    >
      <div className="w-[20%] flex justify-start items-center">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/242px-Telegram_2019_Logo.svg.png"
          alt="telegram"
          className="w-full"
        />
      </div>
      <div className={`flex flex-col text-white flex-grow justify-center ml-1`}>
        <h1 className="text-tertiary uppercase">{quest.questName}</h1>
        <h2 className="text-tertiary">
          +{quest.requiredOrbs.multiOrbs}
          <span className="pl-2 gradient-multi">Multi ORB(S)</span>
        </h2>
      </div>
      <div className="flex justify-center items-center w-[8%] ">
        {quest.isCompleted ? (
          <Check color="white" />
        ) : (
          <>
            {!claim ? (
              <ChevronRight className="absolute" size={"30px"} color="white" />
            ) : (
              <Download className="absolute" size={"30px"} color="white" />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
