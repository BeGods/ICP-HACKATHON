import { useTonAddress, useTonConnectModal } from "@tonconnect/ui-react";
import { Settings } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/context";
import { useTranslation } from "react-i18next";
import SettingModal from "../../components/Modals/Settings";
import { showToast } from "../../components/Toast/Toast";
import MilestoneCard from "../../components/Cards/Reward/OrbRewardCrd";
import { connectTonWallet } from "../../utils/api";
import { ProfileGuide } from "../../components/Common/Tutorials";
import { useProfileGuide } from "../../hooks/Tutorial";
import ProfileHeader from "./Header";
import TaskItem from "../../components/Cards/Tasks/TaskItem";
import {
  ToggleRight,
  ToggleLeft,
} from "../../components/Common/SectionToggles";

const tele = window.Telegram?.WebApp;

const Profile = (props) => {
  const { t } = useTranslation();
  const { userData, socialQuestData, authToken, setShowCard } =
    useContext(MyContext);
  const avatarColor = localStorage.getItem("avatarColor");
  const userFriendlyAddress = useTonAddress();
  const [enableGuide, setEnableGuide] = useProfileGuide("tut4");
  const { state } = useTonConnectModal();
  const [currState, setCurrState] = useState(0);
  const totalSections = Math.ceil(socialQuestData.length / 3);
  const quests = socialQuestData.sort((a, b) => a.isCompleted - b.isCompleted);

  console.log(quests);

  const handleCopyLink = async () => {
    tele.HapticFeedback.notificationOccurred("success");

    await navigator.clipboard.writeText(
      `https://t.me/BeGods_bot/forgesoffaith?startapp=${userData.referralCode}`
    );
    showToast("copy_link");
  };

  const handleConnectTon = async () => {
    try {
      await connectTonWallet({ tonAddress: userFriendlyAddress }, authToken);
      localStorage.setItem("tonConnected", "true");
      showToast("ton_connect_success");
    } catch (error) {
      const errorMessage =
        error.response.data.error ||
        error.response.data.message ||
        error.message ||
        "An unexpected error occurred";
      console.log(errorMessage);
      showToast("ton_connect_error");
    }
  };

  useEffect(() => {
    if (
      state.closeReason == "wallet-selected" &&
      state.status == "closed" &&
      !localStorage.getItem("tonConnected")
    ) {
      handleConnectTon();
    }
  }, [state]);

  useEffect(() => {
    if (enableGuide) {
      setShowCard(
        <ProfileGuide
          handleClick={() => {
            setShowCard(null);
          }}
        />
      );
    }
  }, [enableGuide]);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
      }}
      className="flex flex-col h-screen overflow-hidden m-0"
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          zIndex: -1,
        }}
        className="background-wrapper"
      >
        <div
          className={`absolute top-0 left-0 h-full w-full filter-other`}
          style={{
            backgroundImage: `url(/assets/uxui/1280px-fof.base.background.jpg)`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        />
      </div>
      {/* Header */}
      <ProfileHeader
        userData={userData}
        avatarColor={avatarColor}
        handleClick={handleCopyLink}
      />
      <div className="flex relative flex-grow justify-center items-start top-0">
        <div className={`flex w-full justify-end top-0 `}>
          <div
            onClick={() => {
              setShowCard(
                <SettingModal
                  close={() => {
                    setShowCard(null);
                  }}
                />
              );
            }}
            className="flex justify-center items-center bg-black h-[60px] w-[60px] mr-[35px] z-50 rounded-full mt-2"
          >
            <Settings color="white" size={"35px"} />
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-start items-center absolute h-[70%] w-full bottom-0 px-2.5">
        <div className="flex min-h-[60%] w-[75%] flex-col gap-[15px]">
          {socialQuestData
            .sort((a, b) => b.isQuestClaimed - a.isQuestClaimed)
            .slice(currState, currState + 3)
            .map((quest, index) => {
              return (
                <div key={index}>
                  <TaskItem
                    quest={quest}
                    claimCard={() => {
                      setShowCard(
                        <MilestoneCard
                          t={t}
                          isMulti={true}
                          isOrb={true}
                          isBlack={false}
                          activeMyth={4}
                          isForge={true}
                          closeCard={() => {}}
                          handleClick={() => {
                            tele.HapticFeedback.notificationOccurred("success");
                            setShowCard(null);
                          }}
                        />
                      );
                    }}
                  />
                </div>
              );
            })}
        </div>
      </div>

      <div className="flex absolute bottom-[15%] gap-3 justify-center items-center w-full">
        {Array.from({ length: totalSections }, (_, index) => (
          <div
            onClick={() => {
              setCurrState(index * 3);
            }}
            key={index}
            className={`h-3.5 w-3.5 ${
              Math.floor(currState / 3) === index ? "bg-white" : "border"
            } rounded-full`}
          ></div>
        ))}
      </div>

      {/* Toggles */}
      <ToggleLeft
        handleClick={() => {
          setCurrState((prev) => {
            const newState = prev - 3;
            return newState < 0 ? (totalSections - 1) * 3 : newState;
          });
        }}
        activeMyth={4}
      />
      <ToggleRight
        handleClick={() => {
          setCurrState((prev) => {
            const newState = prev + 3;
            return newState >= socialQuestData.length ? 0 : newState;
          });
        }}
        activeMyth={4}
      />
    </div>
  );
};

export default Profile;
