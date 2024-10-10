import { Check, ChevronRight, Download, Loader } from "lucide-react";
import React, { useContext, useRef, useState } from "react";
import { showToast } from "../Toast/Toast";
import { claimSocialTask } from "../../utils/api";
import { MyContext } from "../../context/context";

const ProfileCard = ({ quest, claimCard }) => {
  const { authToken, socialQuestData, setSocialQuestData } =
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
        claimCard();
        setSocialQuestData(updatedQuestData);
        showToast("task_succes");
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
        if (!quest.isCompleted && claim === false) {
          window.open(quest?.link, "_blank");
          setClaim(true);
        } else if (!quest.isCompleted && claim === true) {
          handleClaimTask();
        }
      }}
      className="flex gap-[8px] text-center items-center bg-black w-full p-[15px] rounded-primary"
    >
      <div className="flex items-center gap-[20px] rounded-primary w-full">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/242px-Telegram_2019_Logo.svg.png"
          alt="telegram"
          className="w-[32px] h-[32px]"
        />
        <div className="text-left text-white">
          <h3 className="text-[14px]">{quest.questName}</h3>
          <p className="text-[10px]">
            +3 <span className="gradient-multi">Multi ORB(S)</span>
          </p>
        </div>
      </div>
      {quest.isCompleted ? (
        <Check color="white" />
      ) : (
        <>
          {claim == false ? (
            <ChevronRight color="white" />
          ) : (
            <Download color="white" />
          )}
        </>
      )}
    </div>
  );
};

export default ProfileCard;
