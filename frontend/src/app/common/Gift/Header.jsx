import { useContext, useEffect, useState } from "react";
import { FofContext, MainContext } from "../../../context/context";
import { useTranslation } from "react-i18next";
import { handleClickHaptic } from "../../../helpers/cookie.helper";

const BottomChild = ({ partners }) => {
  return (
    <div className="flex w-full justify-center px-2 mt-4 top-0 absolute">
      <div className="flex justify-between  relative w-full max-w-[720px] px-7">
        <div
          className={`flex relative   gap-3 items-center rounded-primary h-button-primary text-white bg-glass-black border w-full`}
        >
          <div
            className={`font-symbols absolute -ml-[2rem] text-iconLg text-black-lg-contour text-white`}
          >
            1
          </div>
          <div className="text-primary pl-headSides"></div>
        </div>
        <div
          className={`flex   relative justify-end  border gap-3  items-center rounded-primary h-button-primary text-white bg-glass-black w-full`}
        >
          <div className="text-primary pr-headSides"></div>
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

const CenterChild = (props) => {
  const { platform, assets, enableHaptic } = useContext(MainContext);

  return (
    <div className="flex absolute justify-center w-full z-20 top-0 ">
      <div
        onClick={() => {
          handleClickHaptic(tele, enableHaptic);
          setSection(4);
        }}
        className={`flex text-center justify-center h-symbol-primary w-symbol-primary overflow-hidden items-center rounded-full`}
      >
        <img
          src={assets.uxui.baseOrb}
          alt="base-orb"
          className={`w-full h-full`}
        />
        <div
          className={`z-1 opacity-50 flex justify-center items-center font-symbols text-white text-[6rem] transition-all duration-1000 myth-glow-greek text-black-icon-contour orb-symbol-shadow absolute h-full w-full rounded-full`}
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
      <div className="flex flex-col gap-[5px] pt-headTop">
        {/* <div
          className={`text-sectionHead text-white -mt-2.5 text-center top-0 text-black-lg-contour uppercase absolute inset-0 w-fit h-fit z-30 mx-auto`}
        >
          {changeText ? t("sections.gifts") : t("sections.voucher")}
        </div> */}
        <BottomChild partners={partners} />
        <CenterChild />
      </div>
    </div>
  );
};

export default GiftHeader;
