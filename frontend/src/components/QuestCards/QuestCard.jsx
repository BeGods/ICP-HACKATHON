import React from "react";
import { mythSections } from "../../utils/variables";
import MappedOrbs from "../Common/MappedOrbs";
import Symbol from "../Common/Symbol";

const QuestCard = ({ quest, activeMyth, Button, t, InfoIcon, curr }) => {
  console.log(activeMyth);
  return (
    <div className="relative mt-[30px]">
      <div className="relative">
        <img
          src={`/assets/cards/320px-${mythSections[activeMyth]}.quest.${quest?.type}.png`}
          alt="card"
          className={`w-full h-[75%] ${!quest.isQuestClaimed && "grayscale"}`}
        />
        <div className="absolute top-0 right-0 h-full w-full cursor-pointer flex flex-col justify-between">
          <div className="flex w-full">
            <div className="flex flex-grow">
              <div className="w-full pl-2 mt-2">
                <MappedOrbs quest={quest} />
              </div>
            </div>
            {InfoIcon}
          </div>
          <div
            className={`flex relative items-center h-[19%] uppercase glow-quest text-white`}
          >
            <div className="absolute text-primary  z-50 right-0 top-0 -mt-[30px] pr-2">
              <span>{curr + 1}/12 </span>
            </div>
            <div
              style={{
                backgroundImage: `url(/assets/uxui/fof.footer.paper.png)`,
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
            <div className="flex justify-between w-full h-full items-center px-2 z-10">
              <div className="w-full  text-left">
                {t(
                  `quests.${mythSections[activeMyth]}.${quest.type}.QuestName`
                )}
                <div className="text-right font-medium text-white text-secondary -mt-1 gap-1 flex justify-start w-full">
                  {/* <span>{curr + 1}/12 </span> */}
                  {/* <span
                    className={`text-${mythSections[activeMyth]}-text uppercase`}
                  >
                    {t(`keywords.faith`)}
                  </span> */}
                </div>
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
