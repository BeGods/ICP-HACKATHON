import React, { useContext, useState } from "react";
import ProfileCard from "../../components/Cards/Tasks/TaskItem";
import { MyContext } from "../../context/context";
import { useTranslation } from "react-i18next";
import MilestoneCard from "../../components/Cards/Reward/OrbRewardCrd";
import Header from "../../components/Common/Header";

const tele = window.Telegram?.WebApp;

const HeaderContent = ({ userData, avatarColor, t }) => {
  return (
    <div className="flex justify-between relative w-full">
      {/* Left */}
      {/* ORB */}
      <div className="flex absolute justify-center w-full">
        <div
          className={`h-[36vw] flex justify-center mt-0.5 items-center relative text-white w-[36vw] ${avatarColor} rounded-full`}
        >
          <div className="absolute flex flex-col text-center justify-center">
            <div className="text-primary uppercase">
              {userData.telegramUsername}
            </div>
            <h2 className="uppercase text-secondary text-black">
              {t(`main.fdg`)}
            </h2>
          </div>
        </div>
      </div>
      {/* Right */}
    </div>
  );
};

const Tasks = (props) => {
  const { t } = useTranslation();
  const { userData, socialQuestData } = useContext(MyContext);
  const avatarColor = localStorage.getItem("avatarColor");
  const [showClaim, setShowClaim] = useState(false);

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
      <Header
        children={
          <HeaderContent avatarColor={avatarColor} userData={userData} t={t} />
        }
      />
      <div className="flex flex-grow justify-center items-center"></div>

      {/* Content */}
      <div className="flex flex-col px-2 gap-2 relative flex-grow justify-start items-cente pt-4">
        {socialQuestData.map((quest, index) => {
          return (
            <div key={index}>
              <ProfileCard
                quest={quest}
                claimCard={() => {
                  setShowClaim(true);
                }}
              />
            </div>
          );
        })}
      </div>

      {showClaim && (
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
            setShowClaim(false);
          }}
        />
      )}
    </div>
  );
};

export default Tasks;
