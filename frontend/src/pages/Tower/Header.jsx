import { useContext, useEffect, useState } from "react";
import { mythSymbols, wheel } from "../../utils/constants";
import { MyContext } from "../../context/context";
import Header from "../../components/Common/Header";

const tele = window.Telegram?.WebApp;

const CenterChild = ({ platform }) => {
  const { setSection } = useContext(MyContext);

  return (
    <div className="flex absolute justify-center w-full">
      {/* Orb */}
      <div
        onClick={() => {
          tele.HapticFeedback.notificationOccurred("success");
          setSection(0);
        }}
        className={`z-20 flex text-center glow-icon-white justify-center h-[36vw] w-[36vw] mt-0.5 items-center rounded-full outline outline-[0.5px] outline-white transition-all duration-1000  overflow-hidden relative`}
      >
        <img
          src="/assets/uxui/240px-orb.base.png"
          alt="base-orb"
          className={`filter-orbs-black w-full h-full`}
        />
        <span
          className={`absolute z-1 font-symbols  text-white text-[28vw] ${
            platform === "ios" ? "mt-8 ml-2" : "mt-8 ml-2"
          } opacity-50 orb-symbol-shadow`}
        >
          {mythSymbols["other"]}
        </span>
      </div>
    </div>
  );
};

const TopChild = ({ myth }) => {
  return (
    <div className="absolute flex w-full justify-between top-0 z-50">
      <div className="ml-[13vw]">
        {myth !== 0 ? (
          <>
            <div
              className={`font-symbols text-black-md-contour text-[50px] mt-0.5 transition-all duration-1000 text-${wheel[myth]}-text`}
            >
              {mythSymbols[wheel[myth]]}
            </div>
          </>
        ) : (
          <>
            {" "}
            <div
              className={`font-symbols  text-black-md-contour mt-0.5 text-[50px] text-black-contour transition-all duration-1000 text-white`}
            >
              {mythSymbols["other"]}
            </div>
          </>
        )}
      </div>
      <div className="flex relative text-center justify-center items-center w-[12vw] h-[12vw] mt-[14px] glow-icon-white mr-[13vw] rounded-full">
        <img
          src="/assets/uxui/240px-orb.multicolor.png"
          alt="multiOrb"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};

const BottomChild = ({ gameData, sessionOrbs, myth }) => {
  return (
    <div className="flex justify-center -mt-[4vh]">
      <div
        className={`flex text-num pl-6 text-black-lg-contour text-white items-center border justify-start h-button-primary w-button-primary bg-black z-10 rounded-primary transform skew-x-12`}
      >
        {myth !== 0 ? (
          <>{gameData?.mythologies[myth - 1]?.orbs - sessionOrbs * 2}</>
        ) : (
          <>{gameData.blackOrbs}</>
        )}
      </div>
      <div
        className={`flex text-num pr-6 text-black-lg-contour text-white items-center border justify-end h-button-primary w-button-primary bg-black z-10 rounded-primary transform -skew-x-12`}
      >
        {gameData.multiColorOrbs}
      </div>
    </div>
  );
};

const TowerHeader = ({ gameData, myth, sessionOrbs }) => {
  const [platform, setPlatform] = useState(null);

  useEffect(() => {
    const teleConfi = async () => {
      if (tele) {
        await tele.ready();
        setPlatform(tele.platform);
      }
    };
    teleConfi();
  }, []);

  return (
    <Header
      BottomChild={
        <BottomChild
          gameData={gameData}
          myth={myth}
          sessionOrbs={sessionOrbs}
        />
      }
      TopChild={<TopChild myth={myth} />}
      CenterChild={<CenterChild platform={platform} />}
    />
  );
};

export default TowerHeader;
