import React from "react";
import { useTranslation } from "react-i18next";

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

export const QuestGuide = ({ handleClick }) => {
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
        className="flex relative flex-grow font-symbols items-center text-white "
      >
        <div className="font-symbols  text-white text-[40vw] z-[99] top-10 scale-point">
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
      >
        <div className="font-symbols  text-white text-[40vw]  top-5 scale-point">
          b
        </div>
      </div>
      <div className="h-[20%] flex justify-center items-center  bottom-0 px-10 w-screen bg-black  text-white text-center uppercase">
        <div className="text-primary break-words">
          {t("tutorial.boosters.desc")}
        </div>
      </div>
    </div>
  );
};

export const ProfileGuide = ({ handleClick }) => {
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
        className="flex relative flex-grow font-symbols items-center text-white "
      >
        <div className="font-symbols  text-white text-[24vw] z-[99] mt-[60vw]  ml-[24vw] scale-point">
          b
        </div>
      </div>
      <div className="h-[12%] flex justify-center items-center  bottom-0 px-10 w-screen bg-black text-white text-center uppercase">
        <div className="text-primary break-words">
          {t("tutorial.profile.desc")}
        </div>
      </div>
    </div>
  );
};
