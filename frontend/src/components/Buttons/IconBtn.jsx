import React, { useContext, useState } from "react";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import { MainContext } from "../../context/context";

const tele = window.Telegram?.WebApp;

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
      className={`absolute cursor-pointer z-[60] flex w-full justify-end top-0  right-0 `}
    >
      <img
        src={assets.uxui.corner}
        alt="cutout"
        className="rounded-tr-[15px] w-[18%]"
      />
      <div className="absolute flex justify-center items-center w-[2.5rem] h-[2.5rem]">
        {isInfo ? (
          <div
            className={`text-white italic text-black-contour -mt-[1dvh] -mr-[1dvh] text-[3dvh]`}
            style={{ transform: "rotate(-10deg)" }}
          >
            𝒊
          </div>
        ) : (
          <>
            {isFlip ? (
              <div
                className="text-white -mr-[1dvh] text-black-contour text-[2.25rem]"
                style={{ transform: "rotate(-180deg) scaleX(-1)" }}
              >
                {"\u2936"}
              </div>
            ) : (
              <div className="text-white font-roboto -mt-[1dvh] -mr-[1dvh] text-black-contour text-[1.25rem]">
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
