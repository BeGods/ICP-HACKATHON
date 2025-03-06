import React, { useContext, useEffect, useState } from "react";
import { authenticate } from "../../../utils/api.fof";
import {
  fetchHapticStatus,
  setAuthCookie,
  setLangCookie,
  validateAuth,
  validateCountryCode,
  validateLang,
  validateSoundCookie,
} from "../../../helpers/cookie.helper";
import {
  getDeviceAndOS,
  trackComponentView,
  trackEvent,
} from "../../../utils/ga";
import Launcher from "./Launcher";
import DesktopScreen from "./Desktop";
import { MainContext } from "../../../context/context";
import i18next from "i18next";
import { getRandomColor } from "../../../helpers/randomColor.helper";
import { showToast } from "../../../components/Toast/Toast";

const tele = window.Telegram?.WebApp;

const IntroPage = (props) => {
  const {
    assets,
    enableHaptic,
    setEnableHaptic,
    enableSound,
    setEnableSound,
    platform,
    setPlatform,
    setAuthToken,
    setCountry,
    setLang,
  } = useContext(MainContext);

  const [tgUserData, setTgUserData] = useState(null);
  const [referralCode, setReferralCode] = useState(null);
  const [disableDesktop, setDisableDestop] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

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
          const param = tele.initDataUnsafe?.start_param ?? null;

          setTgUserData(userDataObj);

          if (param) {
            if (param?.includes("FDG")) {
              setReferralCode(param);
            } else {
              setLangCookie(tele, param);
            }
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
      const response = await authenticate(tgUserData, referralCode);
      setAuthToken(response.data.token);
      await setAuthCookie(tele, response.data.token);
    } catch (error) {
      console.error("Authentication Error: ", error);
    }
  };

  const syncAllCookies = async () => {
    try {
      const activeCountry = await validateCountryCode(tele);
      localStorage.setItem("avatarColor", getRandomColor());
      const currLang = await validateLang(tele);
      const isSoundActive = await validateSoundCookie(tele);
      const isHapticActive = await fetchHapticStatus(tele);

      i18next.changeLanguage(currLang);
      setEnableHaptic(isHapticActive);
      setEnableSound(JSON.parse(isSoundActive));
      setCountry(activeCountry);

      const device = getDeviceAndOS(tele.platform);
      trackEvent("device", device, "success");
      trackComponentView("landing_page");
    } catch (error) {
      showToast("default");
    }
  };

  useEffect(() => {
    syncAllCookies();
    getUserData();

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
        setDisableDestop(true);
      } else {
        setDisableDestop(false);
        setTimeout(() => {
          (async () => await auth())();
        }, 1000);
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

  const handleUpdateIdx = (num) => {
    setActiveIndex(num);
  };

  return (
    <div className={`${activeIndex == 2 ? "bg-white" : "bg-black"}`}>
      {disableDesktop ? (
        <DesktopScreen />
      ) : (
        <Launcher handleUpdateIdx={handleUpdateIdx} activeIndex={activeIndex} />
      )}
    </div>
  );
};

export default IntroPage;
