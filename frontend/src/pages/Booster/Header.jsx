import { mythSections } from "../../utils/constants";
import Symbol from "../../components/Common/Symbol";
import Header from "../../components/Common/Header";

const tele = window.Telegram?.WebApp;

const CenterChild = ({ activeMyth, showSymbol }) => {
  return (
    <div className="flex absolute justify-center w-full mt-1 z-20">
      <div
        onClick={() => {
          tele.HapticFeedback.notificationOccurred("success");
          showSymbol();
        }}
        className="h-full z-20"
      >
        <Symbol myth={mythSections[activeMyth]} isCard={false} />
      </div>
    </div>
  );
};
const BottomChild = ({ activeMyth, gameData }) => {
  return (
    <div className="flex justify-center -mt-[4vh]">
      <div
        className={`flex text-num pl-6 text-black-lg-contour text-white items-center border border-${mythSections[activeMyth]}-primary justify-start h-button-primary w-button-primary bg-black z-10 rounded-primary transform skew-x-12`}
      >
        L{gameData.automatalvl + 1}
      </div>
      <div
        className={`flex text-num pr-6 text-black-lg-contour text-white items-center border border-${mythSections[activeMyth]}-primary justify-end h-button-primary w-button-primary bg-black z-10 rounded-primary transform -skew-x-12`}
      >
        L{gameData.shardslvl}
      </div>
    </div>
  );
};

const TopChild = ({ activeMyth }) => {
  return (
    <div className="absolute flex w-full justify-between top-0 z-50 text-white">
      <div
        className={`font-symbols glow-icon-${mythSections[activeMyth]} ml-[13vw] mt-0.5 text-[50px] transition-all duration-1000`}
      >
        n
      </div>
      <div
        className={`font-symbols glow-icon-${mythSections[activeMyth]} mr-[13vw] mt-0.5 text-[50px] transition-all duration-1000`}
      >
        m
      </div>
    </div>
  );
};

const BoosterHeader = ({ activeMyth, showSymbol, gameData }) => {
  return (
    <Header
      handleClick={showSymbol}
      TopChild={<TopChild activeMyth={activeMyth} />}
      BottomChild={<BottomChild activeMyth={activeMyth} gameData={gameData} />}
      CenterChild={
        <CenterChild activeMyth={activeMyth} showSymbol={showSymbol} />
      }
    />
  );
};

export default BoosterHeader;
