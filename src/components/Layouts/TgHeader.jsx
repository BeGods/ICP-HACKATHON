import React, { useContext, useEffect, useState } from "react";
import { Bell, Maximize2, Minimize2, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FofContext, MainContext, RorContext } from "../../context/context";
import { handleClickHaptic } from "../../helpers/cookie.helper";
import { useTranslation } from "react-i18next";
import { connectLineWallet } from "../../utils/api.fof";
import { isDesktop } from "../../utils/device.info";

const tele = window.Telegram?.WebApp;

const TgHeader = ({ openSettings, hideExit, openNotifications }) => {
  const { enableHaptic, isTelegram, authToken } = useContext(MainContext);
  const { t } = useTranslation();
  const [showLoading, setShowLoading] = useState(false);
  const [dots, setDots] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev === 3 ? 1 : prev + 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleConnectLineWallet = async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    try {
      const walletData = await connectWallet();
      if (!walletData) {
        return;
      }
      const { signature, message } = walletData;
      await connectLineWallet(signature, message, authToken);
    } catch (error) {
      console.error("Wallet Connection Error:", error);
      alert("An error occurred while connecting the wallet.");
    } finally {
      setIsConnecting(false);
    }
  };

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
      className={`absolute flex justify-between w-full gap-x-5 ${
        isTelegram ? "pr-[94px] pl-[95px] top-[-35px]" : "px-[20px] top-[-32px]"
      } text-white z-50`}
    >
      <div>
        {!hideExit && (
          <div onClick={handleExit} className="text-[1.25rem] cursor-pointer">
            💤
          </div>
        )}
      </div>

      <div className="flex gap-x-4">
        {!hideExit && (
          <>
            {/* <div className="relative mt-0.5">
              <Bell
                size={24}
                onClick={() => {
                  handleClickHaptic(tele, enableHaptic);
                  openNotifications();
                }}
              />
            </div> */}
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

        <Settings
          size={24}
          onClick={() => {
            handleClickHaptic(tele, enableHaptic);
            openSettings();
          }}
          className="cursor-pointer"
        />
      </div>

      {showLoading && (
        <div className="fixed flex flex-col justify-center items-center inset-0 bg-black backdrop-blur-[3px] bg-opacity-85 z-50">
          <div className="text-white font-fof text-black-contour text-[1.5rem] relative font-medium">
            {t("keywords.load")}
            <span className="absolute">{".".repeat(dots)}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TgHeader;
