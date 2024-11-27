import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { formatTwoNums } from "../../helpers/leaderboard.helper";

const BottomChild = ({ pieces, currIndex }) => {
  return (
    <div className="flex relative justify-center px-2 -mt-3">
      <div className="flex w-full px-7">
        <div
          className={`flex broder  gap-3 items-center rounded-primary h-button-primary text-white bg-glass-black border w-full`}
        >
          <div className="text-primary pl-headSides">
            {formatTwoNums(currIndex + 1)}
          </div>
        </div>
        <div
          className={`flex justify-end  border gap-3  items-center rounded-primary h-button-primary text-white bg-glass-black w-full`}
        >
          <div className="text-primary pr-headSides">
            {formatTwoNums(pieces)}
          </div>
        </div>
      </div>
      <div className="flex text-white justify-between absolute w-[98%] top-0 -mt-4">
        <div
          className={`font-symbols text-iconLg text-black-lg-contour text-white`}
        >
          1
        </div>
        <div
          className={`font-symbols text-iconLg text-black-lg-contour text-white`}
        >
          4
        </div>
      </div>
    </div>
  );
};

const CenterChild = ({ name, bubble, action }) => {
  return (
    <div className="flex absolute justify-center w-full top-0 -mt-1 z-20">
      {/* Orb */}
      <div
        className={`z-20 bg-white flex text-center glow-icon-white justify-center h-symbol-primary w-symbol-primary mt-1 items-center rounded-full outline outline-[0.5px] outline-white transition-all duration-1000  overflow-hidden relative`}
      >
        <img
          src={bubble}
          alt="base-orb"
          className={`filter-orbs-black w-full`}
        />
      </div>
    </div>
  );
};

const RedeemHeader = ({ pieces, name, bubble, action, currIndex }) => {
  const [changeText, setChangeText] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setChangeText((prevText) => !prevText);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-[5px] pt-[3.5vh]">
        <div
          className={`text-sectionHead text-white -mt-2.5 text-center top-0 text-black-lg-contour uppercase absolute inset-0 w-fit h-fit z-30 mx-auto`}
        >
          {changeText ? t("profile.partner") : name}
        </div>
        <BottomChild pieces={pieces} currIndex={currIndex} />
        <CenterChild bubble={bubble} name={name} action={action} />
      </div>
    </div>
  );
};

export default RedeemHeader;
