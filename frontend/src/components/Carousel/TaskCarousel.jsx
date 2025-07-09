import React, { useContext, useEffect, useState } from "react";
import "../../styles/carousel.scss";
import { FofContext, MainContext, RorContext } from "../../context/context";
import TaskItem from "../Cards/Tasks/TaskItem";
import SettingModal from "../Modals/Settings";

const tele = window.Telegram?.WebApp;

const TaskCarousel = ({ quests, userData }) => {
  const { game } = useContext(MainContext);
  const fofContext = useContext(FofContext);
  const rorContext = useContext(RorContext);
  const setShowCard =
    game === "fof" ? fofContext.setShowCard : rorContext.setShowCard;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = (e) => setStartY(e.touches[0].clientY);

  const handleTouchEnd = (e) => {
    const endY = e.changedTouches[0].clientY;
    const deltaY = endY - startY;

    if (deltaY > 50 && currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    } else if (deltaY < -50 && currentIndex < quests.length - 4) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  useEffect(() => {
    const exists = quests.some(
      (quest) => quest._id === "fjkddfakj138338huadla"
    );

    if (!exists) {
      quests.unshift({
        _id: "fjkddfakj138338huadla",
        questName: "invite",
        description: "Follow our official account",
        type: "https://i.postimg.cc/9ffPNzps/invite-1.png",
        link: "fgfd",
        mythology: "Other",
        status: "Active",
        requiredOrbs: {
          multiOrbs: 3,
        },
      });
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-full w-[78%]  mt-[2.65rem]">
      <div
        className="wrapper"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className={`carousel carousel-width`}>
          {quests
            .sort((a, b) => {
              if (a._id === "fjkddfakj138338huadla") return -1;
              if (b._id === "fjkddfakj138338huadla") return 1;

              if (a.isQuestClaimed !== b.isQuestClaimed) {
                return a.isQuestClaimed - b.isQuestClaimed;
              }

              if (
                a.requiredOrbs.multiOrbs === 5 &&
                b.requiredOrbs.multiOrbs !== 5
              )
                return -1;
              if (
                a.requiredOrbs.multiOrbs !== 5 &&
                b.requiredOrbs.multiOrbs === 5
              )
                return 1;

              return 0;
            })
            .slice(currentIndex, currentIndex + 4)
            .map((item, index) => {
              let className = "carousel__item";
              let onClick = null;

              if (index === 2) className += " active";
              else if (index === 1) className += " previous";
              else if (index === 0) className += " previous2";
              else if (index === 3) className += " next";

              if (currentIndex > 0 && index === 0) {
                className += " fade-top fade-click-overlay";
                onClick = (e) => {
                  e.stopPropagation();
                  setCurrentIndex((prev) => prev - 1);
                };
              }

              if (currentIndex + 4 < quests.length && index === 3) {
                className += " fade-bottom fade-click-overlay";
                onClick = (e) => {
                  e.stopPropagation();
                  setCurrentIndex((prev) => prev + 1);
                };
              }

              return (
                <div
                  className={className}
                  key={currentIndex + index}
                  onClick={onClick}
                >
                  <div
                    className={
                      onClick ? "pointer-events-none w-full" : "w-full"
                    }
                  >
                    <TaskItem
                      key={item.id}
                      showWallet={() => {}}
                      showSetting={() => {
                        setShowCard(
                          <SettingModal
                            close={() => {
                              setShowCard(null);
                            }}
                          />
                        );
                      }}
                      quest={item}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default TaskCarousel;
