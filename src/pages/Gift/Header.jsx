import { useContext, useEffect, useState } from "react";
import { MyContext } from "../../context/context";
import { useTranslation } from "react-i18next";

const BottomChild = ({ partners }) => {
  return (
    <div className="flex bar-flipped justify-center -mt-[4vh] px-7">
      <div
        className={`flex glow-button-white text-num pl-[18px] text-black-lg-contour text-white items-center border  justify-start h-button-primary w-full bg-black z-10 rounded-primary transform skew-x-[18deg]`}
      >
        {partners}
      </div>
      <div
        className={`flex text-num pr-[18px] text-black-lg-contour text-white items-center border justify-end h-button-primary w-full bg-black z-10 rounded-primary transform -skew-x-[18deg]`}
      >
        0
      </div>
      <div className="flex text-white justify-between absolute w-[98%] top-0 -mt-4 z-50">
        <div className={`font-symbols  text-iconLg text-black-lg-contour`}>
          2
        </div>
        <div className={`font-symbols text-iconLg text-black-contour`}>3</div>
      </div>
    </div>
  );
};

const CenterChild = (props) => {
  const { platform, assets } = useContext(MyContext);

  return (
    <div className="flex absolute justify-center w-full z-20 top-0 -mt-1">
      <div
        onClick={() => {
          tele.HapticFeedback.notificationOccurred("success");
          setSection(4);
        }}
        className={`flex text-center justify-center h-symbol-primary w-symbol-primary overflow-hidden items-center rounded-full`}
      >
        <img
          src={assets.uxui.baseorb}
          alt="base-orb"
          className={`w-full h-full`}
        />
        <div
          className={`z-1 opacity-50 flex justify-center items-start font-symbols text-white text-[22vw] transition-all duration-1000 myth-glow-greek text-black-icon-contour orb-symbol-shadow absolute h-full w-full rounded-full`}
        >
          <div className={`${platform === "ios" ? "mt-4 ml-2" : "mt-5 ml-2"}`}>
            3
          </div>
        </div>
      </div>
    </div>
  );
};

const GiftHeader = ({ partners }) => {
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
          {changeText ? t("profile.partners") : t("profile.charity")}
        </div>
        <BottomChild partners={partners} />
        <CenterChild />
      </div>
    </div>
  );
};

export default GiftHeader;
