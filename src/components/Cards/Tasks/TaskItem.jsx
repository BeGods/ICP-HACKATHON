import React, { useCallback, useContext, useRef, useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { showToast } from "../../Toast/Toast";
import { FofContext, MainContext, RorContext } from "../../../context/context";
import { claimSocialTask } from "../../../utils/api.fof";
import { useTranslation } from "react-i18next";
import { countries } from "../../../utils/country";
import { validateCountryCode } from "../../../helpers/cookie.helper";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import { useAdsgram } from "../../../hooks/Adsgram";
import liff from "@line/liff";

const tele = window.Telegram?.WebApp;

const TaskItem = ({ quest, showSetting, showWallet }) => {
  const [isClicked, setIsClicked] = useState(false);
  const {
    authToken,
    userData,
    country,
    enableHaptic,
    tasks,
    setTasks,
    isTelegram,
    game,
  } = useContext(MainContext);
  const fofContext = useContext(FofContext);
  const rorContext = useContext(RorContext);
  const setGameData =
    game === "fof" ? fofContext.setGameData : rorContext.setGameData;
  const [claim, setClaim] = useState(false);
  const { t } = useTranslation();
  const disableClick = useRef(false);
  const adsgramId = import.meta.env.VITE_AD_TASK_CLAIM;

  const onReward = useCallback(() => {
    setClaim(true);
  }, []);
  const onError = useCallback((result) => {
    showToast("ad_error");
  }, []);

  const showAd = useAdsgram({
    blockId: adsgramId,
    onReward,
    onError,
  });

  const handleCopyLink = async () => {
    try {
      handleClickHaptic(tele, enableHaptic);

      if (isTelegram) {
        await navigator.clipboard.writeText(
          `https://t.me/BeGods_bot/games?startapp=${userData.referralCode}`
        );
      } else if (liff.isInClient()) {
        const permanentLink = await liff.permanentLink.createUrlBy(
          `${import.meta.env.VITE_CLIENT}?refer=${userData.referralCode}`
        );

        if (liff.isApiAvailable("shareTargetPicker")) {
          liff.sendMessages([
            {
              type: "text",
              text: `🚀 Join BeGods Launcher! ${permanentLink}`,
            },
          ]);
        }

        await navigator.clipboard.writeText(permanentLink);
      } else {
        await navigator.clipboard.writeText(
          `${import.meta.env.VITE_CLIENT}?refer=${userData.referralCode}`
        );
      }

      showToast("copy_link");
    } catch (error) {
      alert(error?.message || String(error));
    }
  };

  const handleClaimTask = async () => {
    if (disableClick.current === false) {
      disableClick.current = true;
      setTimeout(() => {
        disableClick.current = false;
      }, 2000);
      try {
        await claimSocialTask({ questId: quest._id, game: game }, authToken);
        const updatedQuestData = tasks.map((item) =>
          item._id === quest._id ? { ...item, isQuestClaimed: true } : item
        );
        setClaim(false);
        if (game == "fof") {
          setGameData((prev) => {
            let updatedStats = { ...prev };

            updatedStats.multiColorOrbs += quest.requiredOrbs.multiOrbs;
            return {
              ...prev,
              multiColorOrbs: updatedStats.multiColorOrbs,
            };
          });
        } else {
          setGameData((prev) => {
            let updatedStats = { ...prev.stats };
            updatedStats.gobcoin += quest.requiredOrbs.multiOrbs;
            return {
              ...prev,
              stats: updatedStats,
            };
          });
        }

        setTasks(updatedQuestData);
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
        handleClickHaptic(tele, enableHaptic);

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
          } else if (quest._id == "6762964c296034c3b3342548") {
            showAd();
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
} rounded-primary h-[90px] w-full bg-glass-black p-[10px] `}
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
      <div className="flex cursor-pointer justify-start items-center">
        <img src={quest.type} alt="task-icon" className=" w-[55px] grayscale" />
      </div>
      <div className={`flex flex-col text-white flex-grow justify-center ml-1`}>
        <h1 className="text-tertiary uppercase">
          {quest._id == "6716097630689b65b6b384ef" &&
          country &&
          country !== "NA"
            ? countries.find((item) => item.code === country).name
            : quest.description === "game"
            ? quest.questName
            : t(`profile.${quest.questName.toLowerCase()}`)}
        </h1>
        <div>
          {game == "fof" ? (
            <h2 className="text-tertiary">
              +{quest.requiredOrbs.multiOrbs}
              <span className="pl-1 gradient-multi">ORB(S)</span>
            </h2>
          ) : (
            <div className="text-tertiary  flex items-center">
              <span className="text-[1.5rem]">
                +{quest.requiredOrbs.multiOrbs}
              </span>
              <span className="pl-1 font-symbols">A</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center w-[8%] pr-4">
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
