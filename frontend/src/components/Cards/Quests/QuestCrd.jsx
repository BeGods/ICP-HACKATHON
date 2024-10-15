import React from "react";
import { mythSections } from "../../../utils/constants";
import MappedOrbs from "../../Common/MappedOrbs";
import Symbol from "../../Common/Symbol";

const QuestCard = ({
  quest,
  activeMyth,
  Button,
  t,
  InfoIcon,
  curr,
  handleClick,
  showClaimEffect,
  isGuideActive,
}) => {
  return (
    <div className="relative w-[70%] mx-auto">
      <div
        onClick={handleClick}
        className={`relative mt-1 card-shadow-black ${
          isGuideActive && "z-[60]"
        }  ${showClaimEffect && "scale-reward"} ${
          quest.isQuestClaimed &&
          `border border-${mythSections[activeMyth]}-primary`
        } rounded-[15px]`}
      >
        <img
          src={`/assets/cards/320px-${mythSections[activeMyth]}.quest.${quest?.type}.jpg`}
          alt="card"
          className={`w-full h-[75%] ${
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
            {!isGuideActive && InfoIcon}
          </div>
          <div
            className={`flex relative items-center h-[19%] uppercase glow-text-quest text-white`}
          >
            <div
              style={{
                backgroundImage: `url(/assets/uxui/fof.footer.rock3.png)`,
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
                <Symbol myth={mythSections[activeMyth]} isCard={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>{Button}</div>
    </div>
  );
};

export default QuestCard;
