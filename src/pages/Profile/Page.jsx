import { Settings } from "lucide-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../../context/context";
import SettingModal from "../../components/Modals/Settings";
import { ProfileGuide } from "../../components/Common/Tutorials";
import { useProfileGuide } from "../../hooks/Tutorial";
import ProfileHeader from "./Header";
import TaskCarousel from "../../components/Carousel/TaskCarousel";
import {
  ToggleLeft,
  ToggleRight,
} from "../../components/Common/SectionToggles";
import { hideBackButton } from "../../utils/teleBackButton";
import { trackComponentView } from "../../utils/ga";

const tele = window.Telegram?.WebApp;

const Profile = (props) => {
  const { userData, socialQuestData, setShowCard, assets, setSection } =
    useContext(MyContext);
  const avatarColor = localStorage.getItem("avatarColor");
  const [enableGuide, setEnableGuide] = useProfileGuide("tutorial04");
  const [showToggles, setShowToggles] = useState(false);

  useEffect(() => {
    if (enableGuide) {
      setShowCard(
        <ProfileGuide
          Header={
            <ProfileHeader
              showGuide={0}
              userData={userData}
              avatarColor={avatarColor}
            />
          }
          currGuide={0}
          Toggles={
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
          }
          currQuest={socialQuestData[0]}
          handleClick={() => {
            setShowCard(null);
          }}
        />
      );
    }
  }, [enableGuide]);

  useEffect(() => {
    // ga
    trackComponentView("profile");

    // disable backbutton
    hideBackButton(tele);

    setTimeout(() => {
      setShowToggles(true);
    }, 300);
  }, []);

  return (
    <div
      style={{
        height: `calc(100svh - var(--tg-safe-area-inset-top) - 55px)`,
      }}
      className="flex flex-col overflow-hidden m-0"
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
      <ProfileHeader userData={userData} avatarColor={avatarColor} />

      <div className="flex flex-col justify-center items-center absolute h-full w-full bottom-0 px-2.5">
        <div className="flex w-[75%] min-h-[60vh] flex-col">
          <TaskCarousel quests={socialQuestData} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
