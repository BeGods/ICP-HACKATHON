import { mythSections } from "../../utils/constants";
import Symbol from "../../components/Common/Symbol";
import Header from "../../components/Common/Header";

const tele = window.Telegram?.WebApp;

const CenterChild = ({ activeMyth, showSymbol }) => {
  return (
    <div className="flex absolute justify-center w-fit rounded-full mt-1 z-20">
      <div
        onClick={() => {
          tele.HapticFeedback.notificationOccurred("success");
          showSymbol();
        }}
        className="h-full z-20"
      >
        <Symbol myth={mythSections[activeMyth]} isCard={2} />
      </div>
    </div>
  );
};

const BottomChild = ({
  activeMyth,
  currQuest,
  todayQuest,
  completedQuests,
  lostQuests,
  quest,
}) => {
  return (
    <div className="flex justify-center -mt-[4vh] px-7">
      <div
        className={`flex text-num pl-3 text-black-lg-contour items-center border  border-${
          mythSections[activeMyth]
        }-primary justify-start ${
          !quest?.isQuestClaimed
            ? `text-${mythSections[activeMyth]}-text glow-button-${mythSections[activeMyth]}`
            : "text-white"
        } justify-start h-button-primary w-full bg-black z-10 rounded-primary transform skew-x-[18deg]`}
      >
        {lostQuests.length}
      </div>
      <div
        className={`flex text-num pr-3 ${
          quest?.isQuestClaimed
            ? ` glow-button-${mythSections[activeMyth]}`
            : "text-white"
        }  text-black-lg-contour items-center border border-${
          mythSections[activeMyth]
        }-primary justify-end h-button-primary w-full text-white bg-black z-10 rounded-primary transform -skew-x-[18deg]`}
      >
        {completedQuests.length}
        <span
          className={`${
            currQuest > todayQuest
              ? `text-${mythSections[activeMyth]}-text`
              : "text-white"
          }`}
        >
          /12
        </span>
      </div>
    </div>
  );
};

const TopChild = ({ activeMyth }) => {
  return (
    <div className="absolute flex w-full justify-between top-0 z-50 text-white">
      <div
        className={`font-symbols glow-icon-${mythSections[activeMyth]} ml-[8vw] mt-0.5 text-[12vw] transition-all duration-1000`}
      >
        i
      </div>
      <div
        className={`font-symbols glow-icon-${mythSections[activeMyth]} mr-[8vw] mt-0.5 text-[12vw] transition-all duration-1000`}
      >
        j
      </div>
    </div>
  );
};

const QuestHeader = ({
  activeMyth,
  showSymbol,
  showClaimEffect,
  currQuest,
  lostQuests,
  todayQuest,
  completedQuests,
  quest,
}) => {
  return (
    <Header
      handleClick={showClaimEffect}
      TopChild={<TopChild activeMyth={activeMyth} />}
      BottomChild={
        <BottomChild
          completedQuests={completedQuests}
          currQuest={currQuest}
          lostQuests={lostQuests}
          todayQuest={todayQuest}
          activeMyth={activeMyth}
          quest={quest}
        />
      }
      CenterChild={
        <CenterChild activeMyth={activeMyth} showSymbol={showSymbol} />
      }
    />
  );
};

export default QuestHeader;
