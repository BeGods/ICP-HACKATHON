import { useTranslation } from "react-i18next";
import { mythSections } from "../../utils/variables";
import Symbol from "../../components/Common/Symbol";

const tele = window.Telegram?.WebApp;

const QuestHeader = ({ activeMyth, t, showSymbol, showClaimEffect }) => {
  const { i18n } = useTranslation();

  return (
    <>
      <div className="flex flex-col flex-grow justify-start items-start text-white pl-5">
        <div className="text-left  gap-1 flex font-medium text-head">
          <span
            className={`text-white glow-myth-${mythSections[activeMyth]} uppercase`}
          >
            QUESTS
          </span>
        </div>
        <h1
          className={` ${i18n.language === "ru" && "text-[10vw] mt-0"} text-${
            mythSections[activeMyth]
          }-text text-black-contour text-[17vw] font-${
            mythSections[activeMyth]
          }  uppercase -mt-4 -ml-2`}
        >
          {t(`mythologies.${mythSections[activeMyth]}`)}
        </h1>
      </div>
      <div
        onClick={() => {
          tele.HapticFeedback.notificationOccurred("success");
          showSymbol();
        }}
        className="h-full -mr-[14%] ml-auto mt-1 z-50"
      >
        <Symbol
          myth={mythSections[activeMyth]}
          showClaimEffect={showClaimEffect}
          isCard={false}
        />
      </div>
    </>
  );
};

export default QuestHeader;
