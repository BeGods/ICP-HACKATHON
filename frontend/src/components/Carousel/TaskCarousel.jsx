import React, { useContext, useState } from "react";
import "../../styles/carousel.scss";
import { MyContext } from "../../context/context";
import { useTranslation } from "react-i18next";
import TaskItem from "../Cards/Tasks/TaskItem";
import SettingModal from "../Modals/Settings";

const tele = window.Telegram?.WebApp;

const TaskCarousel = ({ quests }) => {
  const { t } = useTranslation();
  const { setShowCard } = useContext(MyContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startY, setStartY] = useState(0);

  const handleTouchStart = (e) => setStartY(e.touches[0].clientY);

  const handleTouchEnd = (e) => {
    const endY = e.changedTouches[0].clientY;
    const deltaY = endY - startY;

    if (deltaY > 50 && currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    } else if (deltaY < -50 && currentIndex < quests.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <div
      className="wrapper h-[60vh]"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="carousel">
        {quests.map((item, index) => {
          let className = "carousel__item";
          const offset = index - currentIndex;

          if (currentIndex === 0 && index === quests.length - 1) {
            className += " previous";
          } else if (currentIndex === quests.length - 1 && index === 0) {
            className += " next";
          } else if (offset === 0) {
            className += " active";
          } else if (
            offset === 1 ||
            (currentIndex === quests.length - 1 &&
              offset === -quests.length + 1)
          ) {
            className += " next";
          } else if (
            offset === -1 ||
            (currentIndex === 0 && offset === quests.length - 1)
          ) {
            className += " previous";
          }

          return (
            <div className={className} key={index}>
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
                claimCard={() => {
                  setShowCard(
                    <MilestoneCard
                      t={t}
                      isMulti={true}
                      isOrb={true}
                      isBlack={false}
                      activeMyth={4}
                      isForge={true}
                      closeCard={() => {}}
                      handleClick={() => {
                        tele.HapticFeedback.notificationOccurred("success");
                        setShowCard(null);
                      }}
                    />
                  );
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TaskCarousel;
