import {
  useTonAddress,
  useTonConnectModal,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import { Settings, Wallet } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/context";
import { useTranslation } from "react-i18next";
import SettingModal from "../../components/Modals/Settings";
import { showToast } from "../../components/Toast/Toast";
import MilestoneCard from "../../components/Cards/Reward/OrbRewardCrd";
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
  const { open } = useTonConnectModal();
  const { userData, socialQuestData, setShowCard, assets } =
    useContext(MyContext);
  const avatarColor = localStorage.getItem("avatarColor");
  const [enableGuide, setEnableGuide] = useProfileGuide("lp4");
  const [currState, setCurrState] = useState(0);
  const totalSections = Math.ceil(socialQuestData.length / 3);
  const [showToggles, setShowToggles] = useState(false);

  const handleCopyLink = async () => {
    tele.HapticFeedback.notificationOccurred("success");

    await navigator.clipboard.writeText(
      `https://t.me/BeGods_bot/forgesoffaith?startapp=${userData.referralCode}`
    );
    showToast("copy_link");
  };

  useEffect(() => {
    if (enableGuide) {
      setShowCard(
        <ProfileGuide
          currQuest={socialQuestData[0]}
          handleClick={() => {
            setShowCard(
              <SettingModal
                close={() => {
                  setShowCard(null);
                }}
              />
            );
          }}
        />
      );
    }
  }, [enableGuide]);

  useEffect(() => {
    setTimeout(() => {
      setShowToggles(true);
    }, 300);
  }, []);

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
            backgroundImage: `url(${assets.uxui.basebg})`,
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

      <div className="flex mt-[23vh] mx-auto right-1/2 -mr-[10vw] text-primary absolute text-black-lg-contour text-gold">
        {userData.telegramUsername.charAt(0).toUpperCase() +
          userData.telegramUsername.slice(1).toLowerCase()}
      </div>
      <div className="flex relative flex-grow justify-center items-start top-0">
        <div className={`flex relative w-full justify-end top-0 `}>
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

      <div className="flex flex-col justify-center items-center absolute h-full w-full bottom-0 px-2.5">
        <div className="flex w-[75%] min-h-[40vh] flex-col gap-y-[15px]">
          {socialQuestData
            .sort((a, b) => a.isCompleted - b.isCompleted)
            .slice(currState, currState + 3)
            .map((quest, index) => {
              return (
                <div key={index}>
                  <TaskItem
                    showWallet={() => {
                      open();
                    }}
                    showSetting={() => {
                      setShowCard(
                        <SettingModal
                          close={() => {
                            setShowCard(null);
                          }}
                        />
                      );
                    }}
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

      <div className="flex absolute bottom-[15%] pb-6 gap-3 justify-center items-center w-full">
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
      {showToggles && (
        <>
          <ToggleLeft
            minimize={2}
            handleClick={() => {
              setCurrState((prev) => {
                const newState = prev - 3;
                return newState < 0 ? (totalSections - 1) * 3 : newState;
              });
            }}
            activeMyth={4}
          />
          <ToggleRight
            minimize={2}
            handleClick={() => {
              setCurrState((prev) => {
                const newState = prev + 3;
                return newState >= socialQuestData.length ? 0 : newState;
              });
            }}
            activeMyth={4}
          />
        </>
      )}
    </div>
  );
};

export default Profile;
