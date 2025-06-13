import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatTwoNums } from "../../../helpers/leaderboard.helper";

const BottomChild = ({ pieces, currIndex }) => {
  return (
    <div className="flex relative justify-center px-2 -mt-3">
      <div className="flex w-full max-w-[720px] px-7">
        <div
          className={`flex relative gap-3 items-center rounded-primary h-button-primary text-white bg-glass-black border w-full`}
        >
          <div
            className={`font-symbols absolute -ml-[2rem] text-iconLg text-black-lg-contour text-white`}
          >
            1
          </div>
          <div className="text-primary pl-headSides">
            {/* {formatTwoNums(currIndex + 1)} */}
          </div>
        </div>
        <div
          className={`flex relative justify-end  border gap-3  items-center rounded-primary h-button-primary text-white bg-glass-black w-full`}
        >
          <div className="text-primary pr-headSides">
            {/* {formatTwoNums(pieces)} */}
          </div>
          <div
            className={`font-symbols absolute -mr-[2rem] text-iconLg text-black-lg-contour text-white`}
          >
            4
          </div>
        </div>
      </div>
    </div>
  );
};

const CenterChild = ({ name, bubble, action, link }) => {
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
    <div className="flex absolute justify-center w-full top-0  z-20">
      {/* Orb */}
      <div
        onClick={link}
        className={`z-20 ${
          showEffect && "pulse-text"
        } bg-white flex text-center glow-icon-white justify-center h-symbol-primary w-symbol-primary mt-1 items-center rounded-full outline outline-[0.5px] outline-white transition-all duration-1000  overflow-hidden relative`}
      >
        <img
          src={bubble}
          alt="base-orb"
          className={`filter-orbs-black w-full pointer-events-none`}
        />
      </div>
    </div>
  );
};

const RedeemHeader = ({ pieces, name, bubble, action, currIndex, link }) => {
  const [changeText, setChangeText] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setChangeText((prevText) => !prevText);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full">
      <div className="flex flex-col w-full gap-[5px] pt-headTop">
        {/* <div
          className={`text-sectionHead text-white -mt-2.5 text-center top-0 text-black-lg-contour uppercase absolute inset-0 w-fit h-fit z-30 mx-auto`}
        >
          {changeText ? t("sections.gifts") : t("sections.voucher")}
        </div> */}
        <BottomChild pieces={pieces} currIndex={currIndex} />
        <CenterChild link={link} bubble={bubble} name={name} action={action} />
      </div>
    </div>
  );
};

export default RedeemHeader;
