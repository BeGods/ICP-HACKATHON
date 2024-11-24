import React, { useContext, useEffect, useRef, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { showToast } from "../../Toast/Toast";
import { MyContext } from "../../../context/context";
import { claimSocialTask } from "../../../utils/api";
import { useTranslation } from "react-i18next";
import { countries } from "../../../utils/country";
import { validateCountryCode } from "../../../helpers/cookie.helper";

const tele = window.Telegram?.WebApp;

const TaskItem = ({ quest, showSetting, showWallet }) => {
  const [isClicked, setIsClicked] = useState(false);
  const {
    gameData,
    authToken,
    socialQuestData,
    setSocialQuestData,
    setGameData,
    userData,
    country,
  } = useContext(MyContext);
  const [claim, setClaim] = useState(false);
  const { t } = useTranslation();
  const disableClick = useRef(false);

  const handleCopyLink = async () => {
    tele.HapticFeedback.notificationOccurred("success");

    await navigator.clipboard.writeText(
      `https://t.me/BeGods_bot/forgesoffaith?startapp=${userData.referralCode}`
    );
    showToast("copy_link");
  };

  const handleClaimTask = async () => {
    if (disableClick.current === false) {
      disableClick.current = true;
      setTimeout(() => {
        disableClick.current = false;
      }, 2000);
      try {
        await claimSocialTask({ questId: quest._id }, authToken);
        const updatedQuestData = socialQuestData.map((item) =>
          item._id === quest._id ? { ...item, isQuestClaimed: true } : item
        );
        const updatedGameData = {
          ...gameData,
          multiColorOrbs:
            gameData.multiColorOrbs + quest.requiredOrbs.multiOrbs,
        };
        setClaim(false);
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

        if (quest._id == "fjkddfakj138338huadla") {
          handleCopyLink();
        } else if (!quest.isQuestClaimed && claim === false) {
          if (quest._id == "6716097630689b65b6b384ef") {
            const isCountryActive = validateCountryCode(tele);
            if (isCountryActive) {
              showSetting();
            } else {
              setClaim(true);
            }
          } else if (quest._id == "672b42311767ca93a22805b1") {
            if (userData.tonAddress) {
              setClaim(true);
            } else {
              showWallet();
            }
          } else {
            setClaim(true);

            window.open(quest?.link, "_blank");
          }
        } else if (!quest.isQuestClaimed && claim === true) {
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
        <img src={quest.type} alt="telegram" className="w-full" />
      </div>
      <div className={`flex flex-col text-white flex-grow justify-center ml-1`}>
        <h1 className="text-tertiary uppercase">
          {quest._id == "6716097630689b65b6b384ef" &&
          country &&
          country !== "NA"
            ? countries.find((item) => item.code === country).name
            : t(`profile.${quest.questName.toLowerCase()}`)}
        </h1>
        <h2 className="text-tertiary">
          +{quest.requiredOrbs.multiOrbs}
          <span className="pl-2 gradient-multi">Multi ORB(S)</span>
        </h2>
      </div>
      <div className="flex justify-center items-center w-[8%] ">
        {quest.isQuestClaimed ? (
          <div className="flex justify-center items-center h-[30px] w-[30px] p-1 bg-white rounded-full">
            <Check strokeWidth={3} color="black" />
          </div>
        ) : (
          <>
            {!claim ? (
              <ChevronRight className="absolute" size={"30px"} color="white" />
            ) : (
              <div className="flex justify-center items-center h-[30px] w-[30px] p-1 border-2 rounded-full">
                <Check strokeWidth={3} color="white" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
