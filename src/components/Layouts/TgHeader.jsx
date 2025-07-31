import { useEffect } from "react";
import { Maximize2, Minimize2, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import { isDesktop } from "../../utils/device.info";
import { useStore } from "../../store/useStore";

const tele = window.Telegram?.WebApp;

const TgHeader = ({
  openSettings,
  hideExit,
  isFullscreen,
  setIsFullscreen,
}) => {
  const enableHaptic = useStore((s) => s.enableHaptic);
  const isTelegram = useStore((s) => s.isTelegram);

  const navigate = useNavigate();

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

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

  return (
    <div
      className={`flex h-full justify-between items-center w-full gap-x-5 ${
        isTelegram ? "pr-[94px] pl-[95px] pt-[3px]" : "px-[12px]"
      } text-white`}
    >
      <div className="flex gap-x-4 z-[99]">
        {!hideExit && (
          <>
            <div onClick={handleExit} className="text-[1.25rem] cursor-pointer">
              💤
            </div>
          </>
        )}

        <Settings
          size={22}
          onClick={() => {
            handleClickHaptic(tele, enableHaptic);
            openSettings();
          }}
          className="cursor-pointer"
        />
      </div>

      <div className="flex gap-x-4 z-[99]">
        {!isTelegram && !isDesktop() && (
          <>
            {!isFullscreen ? (
              <Maximize2
                size={22}
                onClick={() => {
                  handleClickHaptic(tele, enableHaptic);
                  toggleFullScreen();
                }}
                className="cursor-pointer"
              />
            ) : (
              <Minimize2
                size={22}
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
    </div>
  );
};

export default TgHeader;
