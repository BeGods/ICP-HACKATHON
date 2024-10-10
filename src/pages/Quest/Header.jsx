import { useTranslation } from "react-i18next";
import { mythSections } from "../../utils/variables";
import Symbol from "../../components/Common/Symbol";

const tele = window.Telegram?.WebApp;

const QuestHeader = ({ activeMyth, t, showSymbol, showClaimEffect }) => {
  const { i18n } = useTranslation();

  return (
    // <>
    //   <div className="flex flex-col flex-grow justify-start items-start text-white pl-5">
    //     <div className="text-left  gap-1 flex font-medium text-head">
    //       <span
    //         className={`text-white glow-myth-${mythSections[activeMyth]} uppercase`}
    //       >
    //         QUESTS
    //       </span>
    //     </div>
    //     <h1
    //       className={` ${i18n.language === "ru" && "text-[10vw] mt-0"} text-${
    //         mythSections[activeMyth]
    //       }-text text-black-contour text-[17vw] font-${
    //         mythSections[activeMyth]
    //       }  uppercase -mt-4 -ml-2`}
    //     >
    //       {t(`mythologies.${mythSections[activeMyth]}`)}
    //     </h1>
    //   </div>
    //   <div
    //     onClick={() => {
    //       tele.HapticFeedback.notificationOccurred("success");
    //       showSymbol();
    //     }}
    //     className="h-full -mr-[14%] ml-auto mt-1 z-50"
    //   >
    //     <Symbol
    //       myth={mythSections[activeMyth]}
    //       showClaimEffect={showClaimEffect}
    //       isCard={false}
    //     />
    //   </div>
    // </>
    <div className="flex justify-between w-full">
      <div
        className={`text-head -mt-2 mx-auto  w-full text-center top-0 absolute z-50 text-white text-black-lg-contour uppercase`}
      >
        QUESTS
      </div>
      <div className="relative flex justify-center w-full">
        {/* Left */}
        <div className="relative">
          <img
            src="/assets/uxui/390px-header-new.png"
            alt="left"
            className={`left-0 h-[36vw] filter-${mythSections[activeMyth]}`}
          />
          <div className="absolute flex w-full justify-center top-0 z-50"></div>
          <div className="absolute flex w-full justify-center  rotate-6 bottom-0 z-50">
            <div
              className={`text-num transition-all italic text-black-lg-contour custom-skew  -mb-[8vw] mr-[18vw] duration-1000 text-white`}
            >
              5
            </div>
          </div>
        </div>
        {/* Orb */}
        <div className="absolute">
          <Symbol
            myth={mythSections[activeMyth]}
            showClaimEffect={showClaimEffect}
            isCard={false}
          />
        </div>
        {/* Right */}
        <img
          src="/assets/uxui/390px-header-new.png"
          alt="left"
          className={`right-0 transform scale-x-[-1]  h-[36vw] filter-${mythSections[activeMyth]}`}
        />
        <div className="absolute flex w-full justify-center top-0 z-50"></div>
        <div className="absolute flex w-full justify-center  -mb-[8vw] ml-[70vw] italic bottom-0 z-50">
          <div
            className={`text-num text-black-lg-contour transition-all text-right -rotate-6 duration-1000 text-white`}
          >
            2
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestHeader;
