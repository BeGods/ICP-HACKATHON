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
    <div className="flex cursor-pointer absolute  justify-center w-full top-0 z-20">
      <div
        onClick={() => {
          handleClickHaptic(tele, enableHaptic);
          showSymbol();
        }}
        className={`h-full z-20 transition-all duration-500 `}
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
      <div className="flex w-full max-w-[720px] px-7">
        <div
          className={`flex border-${mythSections[activeMyth]}-primary justify-start  gap-3 items-center rounded-primary h-button-primary text-white bg-glass-black-lg border w-full`}
        >
          <div
            className={`font-symbols absolute  -ml-[2rem] text-iconLg text-black-lg-contour text-${mythSections[activeMyth]}-text`}
          >
            i
          </div>
          <div className="text-primary text-black-contour pl-headSides">
            {" "}
            {formatTwoNums(lostQuests)}
          </div>
        </div>
        <div
          className={`flex justify-end border-${mythSections[activeMyth]}-primary gap-3  items-center rounded-primary h-button-primary text-white bg-glass-black-lg border w-full`}
        >
          <div className="text-primary text-black-contour pr-headSides">
            {" "}
            {formatTwoNums(completedQuests.length)}
          </div>
          <div
            className={`font-symbols absolute -mr-[2rem] text-iconLg text-black-contour  text-${mythSections[activeMyth]}-text`}
          >
            j
          </div>
        </div>
      </div>
      <div className="absolute flex text-white text-black-contour px-1 w-full mt-[4.5rem] font-fof text-tertiary uppercase">
        <div className={`mr-auto slide-in-out-left`}>UNCLAIMED</div>
        <div className={`ml-auto slide-in-out-right`}>CLAIMED</div>
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
      <div className="flex flex-col gap-[5px] pt-headTop">
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
