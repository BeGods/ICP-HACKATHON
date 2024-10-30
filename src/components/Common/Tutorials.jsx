import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import BoosterItem from "../Cards/Boosters/BoosterItem";
import { MyContext } from "../../context/context";
import MappedOrbs from "./MappedOrbs";
import TaskItem from "../Cards/Tasks/TaskItem";
import assets from "../../assets/assets.json";

export const ForgesGuide = ({ handleClick }) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 backdrop-blur-[3px] flex flex-col items-center z-50">
      <div className="pb-2 h-[20%] w-screen bg-black -mt-1 text-white text-center">
        <div className="flex flex-col text-[12.2vw]  leading-[45px]">
          <span className="font-symbols text-[60px] pb-3">x</span>
          <div className="full break-words">
            {t("tutorial.forge.title")
              .split(" ")
              .map((word, index) => (
                <span key={index} style={{ display: "block" }}>
                  {word}
                </span>
              ))}
          </div>
        </div>
      </div>
      <div
        onClick={handleClick}
        className="flex relative flex-grow font-symbols items-center z-[99] text-white "
      >
        <div className="font-symbols  text-white text-[40vw]  top-5 scale-point">
          b
        </div>
      </div>
      <div className="h-[20%] flex justify-center items-center  bottom-0 px-10 w-screen bg-black  text-white text-center uppercase">
        <div className="text-primary break-words">
          {t("tutorial.forge.desc")}
        </div>
      </div>
    </div>
  );
};

export const QuestGuide = ({ handleClick, currQuest }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 backdrop-blur-[3px] flex  flex-col items-center z-50">
      <div className="pb-2 w-screen bg-black  text-white text-center">
        <div className="flex flex-col text-[12.2vw] mt-2 leading-[45px]">
          <span className="font-symbols text-[60px] pb-3">i</span>
          <div>
            {t("tutorial.quests.title")
              .split(" ")
              .map((word, index) => (
                <span key={index} style={{ display: "block" }}>
                  {word}
                </span>
              ))}
          </div>
        </div>
      </div>
      <div
        onClick={handleClick}
        className="flex relative flex-grow font-symbols items-center z-[99] text-white "
      >
        <div className="font-symbols  text-white text-[40vw]  top-5 scale-point">
          b
        </div>
      </div>
      <div className="h-[12%] flex justify-center items-center  bottom-0 px-10 w-screen bg-black text-white text-center uppercase">
        <div className="text-primary break-words">
          {t("tutorial.quests.desc")}
        </div>
      </div>
    </div>
  );
};

export const BoosterGuide = ({ handleClick }) => {
  const { t } = useTranslation();
  const { activeMyth } = useContext(MyContext);

  return (
    <div className="fixed inset-0 backdrop-blur-[3px] flex flex-col items-center z-50">
      <div className="pb-2 h-[22%] w-screen bg-black -mt-1 text-white text-center">
        <div className="flex flex-col text-[12.2vw]  leading-[45px]">
          <span className="font-symbols text-[60px] pt-2 pb-4">k</span>
          <div>
            {t("tutorial.boosters.title")
              .split(" ")
              .map((word, index) => (
                <span key={index} style={{ display: "block" }}>
                  {word}
                </span>
              ))}
          </div>
        </div>
      </div>
      <div
        onClick={handleClick}
        className="flex relative flex-grow font-symbols items-center z-[99] text-white "
      ></div>
      <div className="h-full w-[70%] pt-[8.5vh]">
        <BoosterItem
          isActive={true}
          handleClick={() => {}}
          activeMyth={activeMyth}
          t={t}
          booster={0}
        />
        {/* <div className="font-symbols  text-white text-[40vw]  top-5 scale-point">
          b
        </div> */}
      </div>
      <div className="h-[20%] flex justify-center items-center  bottom-0 px-10 w-screen bg-black  text-white text-center uppercase">
        <div className="text-primary break-words">
          {t("tutorial.boosters.desc")}
        </div>
      </div>
    </div>
  );
};

export const TowerGuide = ({ handleClick }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 backdrop-blur-[3px] flex  flex-col items-center z-50">
      <div className="pb-2 w-screen bg-black text-white text-center">
        <div className="flex flex-col text-[12.2vw] mt-2 leading-[45px] px-1.5">
          <span className="font-symbols text-[60px] pb-3">x</span>
          <div> {t("tutorial.tower.title")}</div>
        </div>
      </div>
      <div className="flex flex-grow"></div>
      <div
        onClick={handleClick}
        className="absolute flex justify-center items-center h-full w-full"
      >
        <div
          className="relative flex justify-center items-center w-full h-full pointer-events-none scale-wheel-glow"
          style={{
            backgroundImage: `url(${assets.uxui.tower})`,
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="font-symbols text-white text-[24vw] z-[99] text-black-contour scale-point -ml-[24vw] mt-[30vh]">
            b
          </div>
        </div>
      </div>
      <div className="h-[14%] flex justify-center items-center  bottom-0 px-10 w-screen bg-black text-white text-center uppercase">
        <div className="text-primary break-words">
          {t("tutorial.tower.desc")}
        </div>
      </div>
    </div>
  );
};

export const ProfileGuide = ({ handleClick, currQuest }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 backdrop-blur-[3px] flex  flex-col items-center z-50">
      <div className="pb-2 w-screen bg-black text-white text-center">
        <div className="flex flex-col text-[12.2vw] mt-2 leading-[45px]">
          <span className="font-symbols text-[60px] pb-3">t</span>
          <div>
            {t("tutorial.profile.title")
              .split(" ")
              .map((word, index) => (
                <span key={index} style={{ display: "block" }}>
                  {word}
                </span>
              ))}
          </div>
        </div>
      </div>
      <div
        onClick={handleClick}
        className="flex relative flex-grow items-center text-white "
      >
        <div className="h-full mx-auto w-[70%] pt-[2.5vh]">
          <TaskItem quest={currQuest} claimCard={() => {}} />
        </div>
        <div className="font-symbols absolute text-white text-[24vw] z-50 -mt-[35vw]  ml-[40vw] scale-point">
          b
        </div>
      </div>

      <div className="h-[14%] flex justify-center items-center  bottom-0 px-10 w-screen bg-black text-white text-center uppercase">
        <div className="text-primary break-words">
          {t("tutorial.profile.desc")}
        </div>
      </div>
    </div>
  );
};
