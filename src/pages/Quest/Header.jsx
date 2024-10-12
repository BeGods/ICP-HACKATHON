import { mythSections } from "../../utils/constants";
import Symbol from "../../components/Common/Symbol";
import Header from "../../components/Common/Header";

const tele = window.Telegram?.WebApp;

const CenterChild = ({ activeMyth, showSymbol, showClaimEffect }) => {
  return (
    <div className="flex absolute justify-center w-full z-20">
      <div
        onClick={() => {
          tele.HapticFeedback.notificationOccurred("success");
          showSymbol();
        }}
        className="h-full z-20"
      >
        <Symbol
          myth={mythSections[activeMyth]}
          showClaimEffect={showClaimEffect}
          isCard={false}
        />
      </div>
    </div>
  );
};

const BottomChild = ({ shards, orbs }) => {
  return (
    <div className="absolute flex w-full justify-between bottom-0 z-50 mb-[2vh]">
      <div
        className={`text-num transition-all italic text-black-lg-contour custom-skew ml-[13vw]  duration-1000 text-white`}
      >
        1/12
      </div>
      <div
        className={`text-num text-black-lg-contour transition-all text-right mr-[8vw] italic -rotate-6 duration-1000 text-white`}
      >
        2
      </div>
    </div>
  );
};

const TopChild = ({ activeMyth, glowShards, glowBooster, glowSymbol }) => {
  return (
    <div className="absolute flex w-full justify-between top-0 z-50">
      <div
        className={`ml-[13vw] mt-0.5  text-[50px] transition-all duration-1000`}
      >
        D
      </div>
      <div
        className={`mr-[13vw] mt-0.5 text-[50px] transition-all duration-1000`}
      >
        T
      </div>
    </div>
  );
};

const QuestHeader = ({ activeMyth, showSymbol, showClaimEffect }) => {
  return (
    <Header
      TopChild={<TopChild />}
      BottomChild={<BottomChild />}
      CenterChild={
        <CenterChild
          activeMyth={activeMyth}
          showSymbol={showSymbol}
          showClaimEffect={showClaimEffect}
        />
      }
    />
  );
};

export default QuestHeader;

{
  /* <div className="flex justify-between w-full">
<div
  className={`text-head -mt-2 mx-auto  w-full text-center top-0 absolute z-50 text-white text-black-lg-contour uppercase`}
>
  QUESTS
</div>
<div className="relative flex justify-center w-full">

  <div className="relative">
    <img
      src="/assets/uxui/390px-header-new.png"
      alt="left"
      className={`left-0 h-[36vw] filter-${mythSections[activeMyth]}`}
    />
    <div className="absolute flex w-full justify-center top-0 z-50"></div>
    <div className="absolute flex w-full justify-center  rotate-6 bottom-0 z-50">
      <div
        className={`text-num transition-all italic text-black-lg-contour custom-skew  -mb-[8vw] mr-[18vw] duration-1000 text-white`}
      >
        5
      </div>
    </div>
  </div>

  <div className="absolute">
    <Symbol
      myth={mythSections[activeMyth]}
      showClaimEffect={showClaimEffect}
      isCard={false}
    />
  </div>

  <img
    src="/assets/uxui/390px-header-new.png"
    alt="left"
    className={`right-0 transform scale-x-[-1]  h-[36vw] filter-${mythSections[activeMyth]}`}
  />
  <div className="absolute flex w-full justify-center top-0 z-50"></div>
  <div className="absolute flex w-full justify-center  -mb-[8vw] ml-[70vw] italic bottom-0 z-50">
    <div
      className={`text-num text-black-lg-contour transition-all text-right -rotate-6 duration-1000 text-white`}
    >
      2
    </div>
  </div>
</div>
</div> */
}
