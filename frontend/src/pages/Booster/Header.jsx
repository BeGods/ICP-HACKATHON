import { useTranslation } from "react-i18next";
import { mythSections } from "../../utils/variables";
import Symbol from "../../components/Common/Symbol";

const tele = window.Telegram?.WebApp;

const BoosterHeader = ({ activeMyth, t, showSymbol }) => {
  const { i18n } = useTranslation();

  return (
    <>
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
    </>
  );
};

export default BoosterHeader;
