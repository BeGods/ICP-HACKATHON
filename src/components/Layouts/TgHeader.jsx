import React, { useContext, useEffect } from "react";
import { ArrowLeft, Bell, Maximize2, Minimize2, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MainContext } from "../../context/context";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import { isDesktop } from "../../utils/device.info";
import { hideBackButton, showBackButton } from "../../utils/teleBackButton";

const tele = window.Telegram?.WebApp;

const TgHeader = ({ openSettings, hideExit, openNotifications }) => {
  const { enableHaptic, isTelegram, showBack, setShowCard, setSection } =
    useContext(MainContext);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setDots((prev) => (prev === 3 ? 1 : prev + 1));
  //   }, 500);
  //   return () => clearInterval(interval);
  // }, []);

  const handleExit = () => {
    navigate(-1);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      // Not in fullscreen: request it
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        // Safari
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        // IE/Edge
        elem.msRequestFullscreen();
      }
    } else {
      // Already in fullscreen: exit it
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        // Safari
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    if (showBack !== null) {
      (async () =>
        await showBackButton(tele, () => {
          setSection(showBack);
          setShowCard(null);
        }))();
    } else {
      (async () => await hideBackButton(tele))();
    }
  }, [showBack]);

  return (
    <div
      className={`absolute flex justify-between w-full gap-x-5 ${
        isTelegram ? "pr-[94px] pl-[95px] top-[-35px]" : "px-[20px] top-[-32px]"
      } text-white z-50`}
    >
      <div className="flex gap-x-4">
        {!hideExit && (
          <>
            {showBack !== null && !isTelegram ? (
              <div
                onClick={() => {
                  handleClickHaptic(tele, enableHaptic);
                  setSection(showBack);
                  setShowCard(null);
                }}
                className="text-[1.25rem] cursor-pointer"
              >
                <ArrowLeft />
              </div>
            ) : (
              <div
                onClick={handleExit}
                className="text-[1.25rem] cursor-pointer"
              >
                💤
              </div>
            )}
          </>
        )}

        <Settings
          size={24}
          onClick={() => {
            handleClickHaptic(tele, enableHaptic);
            openSettings();
          }}
          className="cursor-pointer"
        />
      </div>

      <div className="flex gap-x-4">
        {!hideExit && (
          <>
            <div className="relative mt-0.5">
              <Bell
                size={24}
                onClick={() => {
                  handleClickHaptic(tele, enableHaptic);
                  openNotifications();
                }}
              />
              <div
                className={`absolute top-0 gelatine right-0 flex justify-center items-center border-[1.5px] font-roboto text-tertiary font-medium bg-orange-600 w-[0.65rem] h-[0.65rem] text-white text-black-sm-contour z-50 rounded-full shadow-[0px_4px_15px_rgba(0,0,0,1)]`}
              ></div>
            </div>
          </>
        )}
        {!isTelegram && !isDesktop() && (
          <>
            {!document.fullscreenElement ? (
              <Maximize2
                size={24}
                onClick={() => {
                  handleClickHaptic(tele, enableHaptic);
                  toggleFullScreen();
                }}
                className="cursor-pointer"
              />
            ) : (
              <Minimize2
                size={24}
                onClick={() => {
                  handleClickHaptic(tele, enableHaptic);
                  toggleFullScreen();
                }}
                className="cursor-pointer"
              />
            )}
          </>
        )}
      </div>

      {/* {showLoading && (
        <div className="fixed flex flex-col justify-center items-center inset-0 bg-black backdrop-blur-[3px] bg-opacity-85 z-50">
          <div className="text-white font-fof text-black-contour text-[1.5rem] relative font-medium">
            {t("keywords.load")}
            <span className="absolute">{".".repeat(dots)}</span>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default TgHeader;
