import { useEffect, useState } from "react";
import TgHeader from "./TgHeader";
import { isDesktop } from "../../utils/device.info";
import SettingModal from "../Modals/Settings";
import { useStore } from "../../store/useStore";

const AppLayout = ({ children }) => {
  const isTgMobile = useStore((s) => s.isTgMobile);
  const setShowCard = useStore((s) => s.setShowCard);

  const [isFullscreen, setIsFullscreen] = useState(
    !!document.fullscreenElement
  );

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div
      className={`flex relative flex-col ${
        isTgMobile
          ? "tg-safe-height"
          : isFullscreen && !isDesktop()
          ? "mobile-safe-height"
          : "browser-container-height"
      } w-screen overflow-hidden`}
    >
      <div className="relative h-[45px] flex flex-col justify-center items-center z-[99] bg-transparent">
        <TgHeader
          hideExit={true}
          openSettings={() => {
            setShowCard(
              <SettingModal
                close={() => {
                  setShowCard(null);
                }}
              />
            );
          }}
          isFullscreen={isFullscreen}
          setIsFullscreen={(state) => setIsFullscreen(state)}
        />
      </div>
      <div className={`h-[100dvh]`}>{children}</div>
    </div>
  );
};

export default AppLayout;
