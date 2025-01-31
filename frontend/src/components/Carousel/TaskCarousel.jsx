import React, { useContext, useEffect, useState } from "react";
import "../../styles/carousel.scss";
import { FofContext } from "../../context/context";
import TaskItem from "../Cards/Tasks/TaskItem";
import SettingModal from "../Modals/Settings";

const tele = window.Telegram?.WebApp;

const TaskCarousel = ({ quests, userData }) => {
  const { setShowCard } = useContext(FofContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = (e) => setStartY(e.touches[0].clientY);

  const handleTouchEnd = (e) => {
    const endY = e.changedTouches[0].clientY;
    const deltaY = endY - startY;

    if (deltaY > 50 && currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    } else if (deltaY < -50 && currentIndex < quests.length - 3) {
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
    <div
      className="wrapper h-[60vh]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {quests.length > 3 && currentIndex >= 1 ? (
        <div
          onClick={() => {
            setCurrentIndex((prevIndex) => prevIndex - 1);
          }}
          className="absolute top-[24%] mr-[2vw] w-full z-50"
        >
          <div className="arrows-up"></div>
        </div>
      ) : (
        <div className="flex absolute text-[8vw] uppercase text-gold text-black-contour h-fit justify-center items-start -mt-[1.5vh]">
          {userData.telegramUsername}
        </div>
      )}
      <div className="carousel">
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
          .slice(currentIndex, currentIndex + 3)
          .map((item, index) => {
            let className = "carousel__item";
            if (index === 0) {
              className += " previous";
            } else if (index === 1) {
              className += " active";
            } else if (index === 2) {
              className += " next";
            }

            return (
              <div className={className} key={currentIndex + index}>
                <TaskItem
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
            );
          })}
      </div>
      {currentIndex < quests.length - 3 && (
        <div
          onClick={() => setCurrentIndex((prevIndex) => prevIndex + 1)}
          className="absolute bottom-[22%] w-full"
        >
          <div className="arrows-down"></div>
        </div>
      )}
    </div>
  );
};

export default TaskCarousel;
