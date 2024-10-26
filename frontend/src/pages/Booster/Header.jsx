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
        <Symbol myth={mythSections[activeMyth]} isCard={2} />
      </div>
    </div>
  );
};
const BottomChild = ({ activeMyth, gameData }) => {
  return (
    <div className="flex bar-flipped justify-center -mt-[4vh] px-7">
      <div
        className={`flex text-num pl-3 text-black-lg-contour text-white items-center border border-${mythSections[activeMyth]}-primary justify-start h-button-primary w-full bg-black z-10 rounded-primary transform skew-x-[18deg]`}
      >
        Lvl {gameData.shardslvl}
      </div>
      <div
        className={`flex text-num pr-3 text-black-lg-contour text-white items-center border border-${mythSections[activeMyth]}-primary justify-end h-button-primary w-full bg-black z-10 rounded-primary transform -skew-x-[18deg]`}
      >
        Lvl {gameData.automatalvl + 1}
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
        m
      </div>
      <div
        className={`font-symbols glow-icon-${mythSections[activeMyth]} mr-[8vw] mt-0.5 text-[12vw] transition-all duration-1000`}
      >
        n
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
