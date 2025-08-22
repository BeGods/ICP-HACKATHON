import { mythSections } from "../../../utils/constants.fof";
import MappedOrbs from "../../Common/MappedOrbs";
import Symbol from "../../Common/Symbol";
import IconBtn from "../../Buttons/IconBtn";
import { CardWrap } from "../../Layouts/Wrapper";
import { useStore } from "../../../store/useStore";

const QuestCard = ({
  quest,
  activeMyth,
  t,
  InfoCard,
  isGuideActive,
  flipButton,
}) => {
  const assets = useStore((s) => s.assets);

  return (
    <CardWrap
      Front={
        <div
          className={`relative h-full card-shadow-black ${
            isGuideActive && "z-[60]"
          }   ${
            quest.isQuestClaimed &&
            `border border-${mythSections[activeMyth]}-primary`
          } rounded-[15px]`}
        >
          <img
            src={assets.questCards?.[mythSections[activeMyth]]?.[quest?.type]}
            alt="card"
            className={`w-full h-full object-cover rounded-[15px] ${
              !quest.isQuestClaimed && "grayscale"
            }`}
          />
          <div className="absolute top-0 right-0 h-full w-full cursor-pointer flex flex-col justify-between">
            <div className="flex w-full">
              <div className="flex flex-grow">
                <div className="w-full pl-2 mt-2">
                  <MappedOrbs quest={quest} />
                </div>
              </div>
              <IconBtn isInfo={true} activeMyth={activeMyth} align={1} />
            </div>
            <div
              className={`flex relative items-center h-[19%] uppercase glow-text-quest text-white`}
            >
              <div
                style={{
                  backgroundImage: `url(${assets.uxui.footer})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  width: "100%",
                }}
                className={`filter-paper-${mythSections[activeMyth]} rounded-b-[15px]`}
              />
              <div className="flex justify-between w-full h-full items-center glow-text-quest px-2 z-10">
                <div className="w-full text-left">
                  {t(
                    `quests.${mythSections[activeMyth]}.${quest.type}.QuestName`
                  )}
                </div>
                <div className="">
                  <Symbol myth={mythSections[activeMyth]} isCard={1} />
                </div>
              </div>
            </div>
          </div>
        </div>
      }
      Back={InfoCard}
      handleClick={() => {
        setTimeout(() => {
          flipButton();
        }, 200);
      }}
    />
  );
};

export default QuestCard;
