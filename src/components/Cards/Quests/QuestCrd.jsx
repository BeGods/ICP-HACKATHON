import React, { useContext, useState } from "react";
import { mythSections } from "../../../utils/constants";
import MappedOrbs from "../../Common/MappedOrbs";
import Symbol from "../../Common/Symbol";
import IconBtn from "../../Buttons/IconBtn";
import { MyContext } from "../../../context/context";

const tele = window.Telegram?.WebApp;

const QuestCard = ({
  quest,
  activeMyth,
  Button,
  t,
  ShareButton,
  InfoCard,
  isGuideActive,
}) => {
  const { assets } = useContext(MyContext);
  const [flipped, setFlipped] = useState(false);
  const [buttonFlip, setButtonFlip] = useState(false);

  return (
    <div className="w-[70%] mt-[7vh] relative flex flex-col gap-2 justify-center items-center mx-auto">
      {!isGuideActive && (
        <IconBtn isInfo={true} activeMyth={activeMyth} align={1} />
      )}
      <div className={`card ${flipped ? "flipped" : ""}`}>
        <div
          onClick={(e) => {
            tele.HapticFeedback.notificationOccurred("success");
            setFlipped((prev) => !prev);
            setTimeout(() => {
              setButtonFlip((prev) => !prev);
            }, 200);
          }}
          className="card__face card__face--front relative"
        >
          <div
            className={`relative card-shadow-black ${
              isGuideActive && "z-[60]"
            }   ${
              quest.isQuestClaimed &&
              `border border-${mythSections[activeMyth]}-primary`
            } rounded-[15px]`}
          >
            <img
              src={assets.questCards?.[mythSections[activeMyth]]?.[quest?.type]}
              alt="card"
              className={`w-full h-full ${
                !quest.isQuestClaimed && "grayscale"
              } rounded-[15px]`}
            />
            <div className="absolute top-0 right-0 h-full w-full cursor-pointer flex flex-col justify-between">
              <div className="flex w-full">
                <div className="flex flex-grow">
                  <div className="w-full pl-2 mt-2">
                    <MappedOrbs quest={quest} />
                  </div>
                </div>
              </div>
              <div
                className={`flex relative items-center h-[19%] uppercase glow-text-quest text-white`}
              >
                <div
                  style={{
                    backgroundImage: `url(${assets.uxui.paper})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "100%",
                  }}
                  className={`filter-paper-${mythSections[activeMyth]} rounded-b-[15px]`}
                />
                <div className="flex justify-between w-full h-full items-center glow-text-quest px-2 z-10">
                  <div className="w-full text-left">
                    {t(
                      `quests.${mythSections[activeMyth]}.${quest.type}.QuestName`
                    )}
                    <div className="text-right font-medium text-white text-secondary -mt-1 gap-1 flex justify-start w-full"></div>
                  </div>
                  <div className="">
                    <Symbol myth={mythSections[activeMyth]} isCard={1} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          onClick={(e) => {
            tele.HapticFeedback.notificationOccurred("success");

            setFlipped((prev) => !prev);
            setTimeout(() => {
              setButtonFlip((prev) => !prev);
            }, 200);
          }}
          className="card__face card__face--back"
        >
          {InfoCard}
        </div>
      </div>
      <div className={`button ${buttonFlip ? "flipped" : ""}`}>
        <div className="button__face button__face--front flex justify-center items-center">
          {Button}
        </div>
        <div className="button__face button__face--back z-50 flex justify-center items-center">
          {ShareButton}
        </div>
      </div>
    </div>
  );
};

export default QuestCard;
