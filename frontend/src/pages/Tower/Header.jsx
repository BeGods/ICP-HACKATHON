import { useContext, useEffect, useState } from "react";
import { mythSymbols, wheel } from "../../utils/variables";
import { MyContext } from "../../context/context";

const tele = window.Telegram?.WebApp;

const TowerHeader = ({ gameData, myth, sessionOrbs }) => {
  const [platform, setPlatform] = useState(null);
  const { setSection } = useContext(MyContext);

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
    <div className="flex justify-between relative w-full">
      <div
        className={`text-head -mt-2 mx-auto text-white-lg-contour w-full text-center top-0 absolute z-30 text-black  uppercase`}
      >
        TOWER
      </div>
      {/* Left */}
      <div className="flex flex-col justify-center h-full px-2">
        {myth !== 0 ? (
          <div className="flex flex-col leading-[45px] mb-4 justify-start ml-1 items-center text-black-contour w-fit h-fit">
            <div className={`text-num transition-all duration-1000 text-white`}>
              {gameData.mythologies[myth - 1].orbs - sessionOrbs * 2}
            </div>
            <div
              className={`font-symbols pt-3  text-[50px] transition-all duration-1000 text-${wheel[myth]}-text`}
            >
              {mythSymbols[wheel[myth]]}
            </div>
          </div>
        ) : (
          <div className="flex flex-col leading-[45px] mb-4 justify-start ml-1 items-center text-black-contour w-fit h-fit">
            <div className={`text-num transition-all duration-1000 text-white`}>
              {gameData.blackOrbs}
            </div>
            <div
              className={`font-symbols pt-3 text-[50px] text-black-contour transition-all duration-1000 text-white`}
            >
              {mythSymbols["other"]}
            </div>
          </div>
        )}
      </div>
      <div className="flex absolute justify-center w-full">
        {/* Orb */}
        <div
          onClick={() => {
            tele.HapticFeedback.notificationOccurred("success");
            setSection(1);
          }}
          className={`z-20 flex text-center glow-icon-white justify-center h-[36vw] w-[36vw] mt-0.5 items-center rounded-full outline moutline outline-[0.5px] outline-white transition-all duration-1000  overflow-hidden relative`}
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
      {/* Right */}

      <div className="flex flex-col justify-center h-full px-2">
        <div className="flex flex-col leading-[45px] mb-4 items-center text-black-contour w-fit h-fit">
          <div className={`text-num transition-all duration-1000 text-white`}>
            {gameData.multiColorOrbs}
          </div>
          <div className="flex relative text-center justify-center items-center max-w-orb mt-3 rounded-full glow-icon-black">
            <img
              src="/assets/uxui/240px-orb.multicolor.png"
              alt="multiOrb"
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TowerHeader;
