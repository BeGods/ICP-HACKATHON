import { mythSections } from "../../../utils/constants.fof";
import Symbol from "../../../components/Common/Symbol";
import { useContext, useEffect, useState } from "react";
import { formatTwoNums } from "../../../helpers/leaderboard.helper";
import { handleClickHaptic } from "../../../helpers/cookie.helper";
import { FofContext } from "../../../context/context";

const tele = window.Telegram?.WebApp;

const CenterChild = ({ activeMyth, showSymbol }) => {
  const { enableHaptic } = useContext(FofContext);
  const [showEffect, setShowEffect] = useState(true);

  useEffect(() => {
    let timer = setTimeout(() => {
      setShowEffect(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <div className="flex  absolute justify-center w-full top-0 z-20">
      <div
        onClick={() => {
          handleClickHaptic(tele, enableHaptic);
          showSymbol();
        }}
        className={`h-full z-20 transition-all duration-500 ${
          showEffect && "pulse-text"
        }`}
      >
        <Symbol myth={mythSections[activeMyth]} isCard={2} />
      </div>
    </div>
  );
};

const BottomChild = ({
  activeMyth,
  currQuest,
  completedQuests,
  lostQuests,
  quest,
  totalQuests,
}) => {
  return (
    <div className="flex relative justify-center px-2 -mt-3">
      <div className="flex w-full px-7">
        <div
          className={`flex border-${
            mythSections[activeMyth]
          }-primary justify-start ${
            !quest?.isQuestClaimed && currQuest < totalQuests.length
              ? `text-${mythSections[activeMyth]}-text glow-button-${mythSections[activeMyth]}`
              : "text-white"
          }  gap-3 items-center rounded-primary h-button-primary text-white bg-glass-black border w-full`}
        >
          <div className="text-primary text-black-contour pl-headSides">
            {" "}
            {formatTwoNums(lostQuests)}
          </div>
        </div>
        <div
          className={`flex justify-end ${
            quest?.isQuestClaimed || currQuest >= totalQuests.length
              ? ` glow-button-${mythSections[activeMyth]}`
              : "text-white"
          }  border-${
            mythSections[activeMyth]
          }-primary gap-3  items-center rounded-primary h-button-primary text-white bg-glass-black border w-full`}
        >
          <div className="text-primary text-black-contour pr-headSides">
            {" "}
            {formatTwoNums(completedQuests.length)}
          </div>
        </div>
      </div>
      <div className="flex text-white justify-between absolute w-[98%] top-0 -mt-4">
        <div
          className={`font-symbols  text-iconLg text-black-lg-contour text-${mythSections[activeMyth]}-text`}
        >
          i
        </div>
        <div
          className={`font-symbols text-iconLg text-black-contour  text-${mythSections[activeMyth]}-text`}
        >
          j
        </div>
      </div>
    </div>
  );
};

const QuestHeader = ({
  activeMyth,
  showSymbol,
  currQuest,
  lostQuests,
  completedQuests,
  quest,
  totalQuests,
}) => {
  const [changeText, setChangeText] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setChangeText((prevText) => !prevText);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-[5px] pt-[3.5vh]">
        {/* <div
          className={`text-sectionHead ${
            changeText ? `text-white` : `text-${mythSections[activeMyth]}-text`
          } -mt-2.5 text-center top-0 text-black-lg-contour uppercase absolute inset-0 w-fit h-fit z-30 mx-auto`}
        >
          {changeText
            ? t("sections.quests")
            : t(`mythologies.${mythSections[activeMyth]}`)}
        </div> */}
        <BottomChild
          completedQuests={completedQuests}
          currQuest={currQuest}
          lostQuests={lostQuests}
          activeMyth={activeMyth}
          quest={quest}
          totalQuests={totalQuests}
        />
        <CenterChild activeMyth={activeMyth} showSymbol={showSymbol} />
      </div>
    </div>
  );
};

export default QuestHeader;
