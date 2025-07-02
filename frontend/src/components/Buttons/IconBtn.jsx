import React, { useContext, useState } from "react";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import { MainContext } from "../../context/context";
import { Undo2 } from "lucide-react";

// mr-[55px] mt-7 - convert info
// -mt-6 ml-6 - jigsaw info
// -mt-7 ml-7 - quest and jigsaw info
// -mt-[28px] ml-[52px] - infoncard close

const tele = window.Telegram?.WebApp;

const alignBasedOnCard = [
  "-mt-[3vh] ml-[10vw]",
  "-mt-[3vh] ml-[5vw]",
  "mt-[9.5vh] mr-[60px]",
  "-mt-[5px] ml-[90px]",
  "mr-[60px] -mt-8",
  "mt-[18vh] -ml-[12vw]",
  "-mt-[4vh] ml-[14vw]",
  "-mt-[0.5vh] ml-[10vw]",
  "-mt-[1vh] ml-[5vw]",
  "mt-[0.7vh] ml-[10vw]",
  "-mt-[2.5vh] ml-[10vw]",
];
const IconBtn = ({ isInfo, isFlip, handleClick, align, isJigsaw }) => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const { enableHaptic, assets } = useContext(MainContext);

  const handleButtonClick = () => {
    handleClickHaptic(tele, enableHaptic);

    setIsButtonClicked(true);

    setTimeout(() => {
      setIsButtonClicked(false);
      handleClick();
    }, 100);
  };

  return (
    <div
      onClick={handleButtonClick}
      className={`absolute cursor-pointer z-[60] flex w-full justify-end top-0  right-0 ${
        isJigsaw && "mt-[1.45rem]"
      } `}
    >
      <img
        src={assets.uxui.corner}
        alt="cutout"
        className="rounded-tr-[15px] w-[18%]"
      />
      <div className="absolute flex justify-center items-center w-[2.5rem] h-[2.5rem]">
        {isInfo ? (
          <div
            className={`text-white italic text-black-contour -mt-1 -mr-1 text-[1.7rem]`}
            style={{ transform: "rotate(-10deg)" }}
          >
            𝒊
          </div>
        ) : (
          <>
            {isFlip ? (
              <div
                className="text-white -mr-1 text-black-contour text-[2.25rem]"
                style={{ transform: "rotate(-180deg) scaleX(-1)" }}
              >
                {"\u2936"}
              </div>
            ) : (
              <div className="text-white font-roboto -mt-2 -mr-2 text-black-contour text-[1.25rem]">
                {"\u2715"}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default IconBtn;
