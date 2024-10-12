import { useTranslation } from "react-i18next";
import { mythSections } from "../../utils/constants";
import Symbol from "../../components/Common/Symbol";
import Header from "../../components/Common/Header";

const tele = window.Telegram?.WebApp;

const CenterChild = ({ activeMyth, showSymbol }) => {
  return (
    <div className="flex absolute justify-center w-full z-20">
      <div
        onClick={() => {
          tele.HapticFeedback.notificationOccurred("success");
          showSymbol();
        }}
        className="h-full z-20"
      >
        <Symbol myth={mythSections[activeMyth]} isCard={false} />
      </div>
    </div>
  );
};

const BottomChild = ({ shards, orbs }) => {
  return (
    <div className="absolute flex w-full justify-between bottom-0 z-50 mb-[2vh]">
      <div
        className={`text-num transition-all italic text-black-lg-contour custom-skew ml-[13vw]  duration-1000 text-white`}
      ></div>
      <div
        className={`text-num text-black-lg-contour transition-all text-right mr-[8vw] italic -rotate-6 duration-1000 text-white`}
      >
        L1-99
      </div>
    </div>
  );
};

const BoosterHeader = ({ activeMyth, showSymbol }) => {
  return (
    <Header
      BottomChild={<BottomChild />}
      CenterChild={
        <CenterChild activeMyth={activeMyth} showSymbol={showSymbol} />
      }
    />
  );
};

export default BoosterHeader;

{
  /* <>
<div
  onClick={() => {
    tele.HapticFeedback.notificationOccurred("success");
    showSymbol();
  }}
  className="h-full -ml-[14%] mr-auto mt-1 z-50"
>
  <Symbol myth={mythSections[activeMyth]} isCard={false} />
</div>
<div className="flex flex-col flex-grow justify-start items-end text-white pr-5">
  <div className="text-right  gap-1 flex font-medium text-head">
    <span
      className={`text-white glow-myth-${mythSections[activeMyth]} uppercase`}
    >
      <span>BOOSTER</span>
    </span>
  </div>
  <h1
    className={`text-${mythSections[activeMyth]}-text ${
      i18n.language === "ru" && "text-[10vw] mt-0"
    }  text-black-contour text-[17vw] font-${
      mythSections[activeMyth]
    }  uppercase -mt-4 -ml-2`}
  >
    {t(`mythologies.${mythSections[activeMyth]}`)}
  </h1>
</div>
</> */
}
