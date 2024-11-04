import { useTonConnectModal } from "@tonconnect/ui-react";
import { Settings } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/context";
import { useTranslation } from "react-i18next";
import SettingModal from "../../components/Modals/Settings";
import { showToast } from "../../components/Toast/Toast";
import { ProfileGuide } from "../../components/Common/Tutorials";
import { useProfileGuide } from "../../hooks/Tutorial";
import ProfileHeader from "./Header";
import TaskCarousel from "../../components/Carousel/TaskCarousel";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";

const tele = window.Telegram?.WebApp;

const Profile = (props) => {
  const { userData, socialQuestData, setShowCard, assets, setSection } =
    useContext(MyContext);
  const avatarColor = localStorage.getItem("avatarColor");
  const [enableGuide, setEnableGuide] = useProfileGuide("lp4");
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

      <div
        className="flex items-center justify-center absolute text-primary text-black-lg-contour text-gold"
        style={{ top: "22vh", left: "50%", transform: "translateX(-50%)" }}
      >
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
        <div className="flex w-[75%] min-h-[60vh] flex-col">
          <TaskCarousel quests={socialQuestData} />
        </div>
      </div>

      {showToggles && (
        <>
          <ToggleLeft
            minimize={2}
            handleClick={() => {
              setSection(5);
            }}
            activeMyth={4}
          />
          <ToggleRight
            minimize={2}
            handleClick={() => {
              setSection(5);
            }}
            activeMyth={4}
          />
        </>
      )}
    </div>
  );
};

export default Profile;
