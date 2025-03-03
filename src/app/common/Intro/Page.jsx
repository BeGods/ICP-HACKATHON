import React, { useEffect, useState } from "react";
import { authenticate } from "../../../utils/api.fof";
import assets from "../../../assets/assets.json";
import {
  setAuthCookie,
  setLangCookie,
  validateSoundCookie,
} from "../../../helpers/cookie.helper";
import { trackComponentView } from "../../../utils/ga";
import Launcher from "./Launcher";
import FoFIntro from "./FoFIntro";
import RoRIntro from "./RoRIntro";
import SettingModal from "../../../components/Modals/Settings";
import { LogOut, Settings } from "lucide-react";
import DesktopScreen from "./Desktop";

const tele = window.Telegram?.WebApp;

const IntroPage = (props) => {
  const [showLauncher, setShowLauncher] = useState(null);
  const [userData, setUserData] = useState(null);
  const [referralCode, setReferralCode] = useState(null);
  const [fadeout, setFadeout] = useState(false);
  const [platform, setPlatform] = useState(null);
  const [enableSound, setEnableSound] = useState(true);
  const [disableDesktop, setDisableDestop] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1);

  // configure tma.auth
  const getUserData = async () => {
    if (tele) {
      try {
        await tele.ready();

        const { user } = tele.initDataUnsafe || {};
        if (!tele.isExpanded) tele.expand();
        setPlatform(tele.platform);

        tele.requestFullscreen();
        tele.lockOrientation();
        tele.enableClosingConfirmation();
        tele.disableVerticalSwipes();
        tele.setHeaderColor("#000000");
        tele.setBackgroundColor("#000000");
        tele.setBottomBarColor("#000000");

        if (user) {
          const userDataObj = {
            initData: tele?.initData,
          };
          const param = tele.initDataUnsafe?.start_param;

          setUserData(userDataObj);

          if (param.includes("FDG")) {
            setReferralCode(param);
          } else {
            setLangCookie(tele, param);
          }
        } else {
          console.log("No user found in Telegram data");
        }
      } catch (error) {
        console.error("Error fetching user data from Telegram:", error);
      }
    } else {
      console.warn("Telegram WebApp is not available");
    }
  };

  // authenticate
  const auth = async () => {
    try {
      const response = await authenticate(userData, referralCode);
      localStorage.setItem("accessToken", response.data.token);
      await setAuthCookie(tele, response.data.token);
    } catch (error) {
      console.error("Authentication Error: ", error);
    }
  };

  const checkSoundActive = async () => {
    const isSoundActive = await validateSoundCookie(tele);
    setEnableSound(isSoundActive);
  };

  useEffect(() => {
    trackComponentView("landing_page");
    getUserData();
    checkSoundActive();

    const handleUserInteraction = () => {
      // playAudio();
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    if (platform) {
      if (
        platform === "macos" ||
        platform === "windows" ||
        platform === "tdesktop" ||
        platform === "web" ||
        platform === "weba" ||
        platform === "unknown"
      ) {
        // setDisableDestop(true);
      } else {
        // setDisableDestop(false);
        // setTimeout(() => {
        //   (async () => await auth())();
        // }, 1000);
      }
      if (platform === "ios") {
        document.body.style.position = "fixed";
        document.body.style.top = `calc(var(--tg-safe-area-inset-top) + 45px)`;
        document.body.style.bottom = "0";
        document.body.style.left = "0";
        document.body.style.right = "0";
        document.body.style.overflow = "hidden";
      }
    }
  }, [platform]);

  const handleSelectGame = (screen) => {
    setShowLauncher(screen);
  };

  const handleUpdateIdx = (num) => {
    setActiveIndex(num);
  };

  return (
    <div className={`${activeIndex == 2 ? "bg-white" : "bg-black"}`}>
      {disableDesktop ? (
        <DesktopScreen />
      ) : (
        <div
          className={`flex w-screen text-wrap`}
          style={{
            height: `calc(100svh - var(--tg-safe-area-inset-top) - 45px)`,
          }}
        >
          <div className="absolute flex gap-5 -top-[35px] right-[94px] text-white z-50">
            <Settings size={"6vw"} />
          </div>
          <Launcher
            handleClick={handleSelectGame}
            handleUpdateIdx={handleUpdateIdx}
            activeIndex={activeIndex}
          />
        </div>
      )}
    </div>
  );
};

export default IntroPage;
