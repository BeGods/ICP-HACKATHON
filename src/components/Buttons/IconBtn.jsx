import React, { useContext, useState } from "react";
import { X } from "lucide-react";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import { FofContext } from "../../context/context";

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
];
const IconBtn = ({ isInfo, handleClick, align }) => {
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const { enableHaptic } = useContext(FofContext);

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
      className={`absolute  flex w-full justify-end top-0 ${alignBasedOnCard[align]} `}
    >
      {isInfo ? (
        <div className="bg-black flex justify-center items-center w-[40px] h-[40px] z-20 rounded-full">
          <h1
            className={`text-white italic mr-1 text-[30px]`}
            style={{ transform: "rotate(-10deg)" }}
          >
            𝒊
          </h1>
        </div>
      ) : (
        <div className="flex justify-center items-center bg-black w-[40px] h-[40px] z-50 rounded-full">
          <X color="white" size={"30px"} />
        </div>
      )}
    </div>
  );
};

export default IconBtn;
