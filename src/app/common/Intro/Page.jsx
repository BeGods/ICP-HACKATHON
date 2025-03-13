import React, { useContext, useEffect, useState } from "react";
import { authenticateOneWave, authenticateTg } from "../../../utils/api.fof";
import {
  fetchHapticStatus,
  setAuthCookie,
  setLangCookie,
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
import { determineIsTelegram } from "../../../utils/device.info";
import { useLocation } from "react-router-dom";

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
    isTelegram,
    setIsTelegram,
  } = useContext(MainContext);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const oneWaveParam = queryParams.get("onewave");
  console.log(oneWaveParam);

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
  const telegramAuth = async () => {
    try {
      const response = await authenticateTg(tgUserData, referralCode);
      setAuthToken(response.data.token);
      await setAuthCookie(tele, response.data.token);
    } catch (error) {
      console.error("Authentication Error: ", error);
    }
  };

  const onewaveAuth = async () => {
    try {
      const response = await authenticateOneWave(oneWaveParam);
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
    getUserData();
    syncAllCookies();

    const handleUserInteraction = () => {
      // playAudio();z
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
      const isTg = determineIsTelegram(platform);
      setIsTelegram(isTg);
      if (
        platform === "macos" ||
        platform === "windows" ||
        platform === "tdesktop" ||
        platform === "web" ||
        platform === "weba" ||
        (platform === "unknown" && !oneWaveParam)
      ) {
        setDisableDestop(true);
      } else {
        setDisableDestop(false);
        if (isTg) {
          setTimeout(() => {
            (async () => await telegramAuth())();
          }, 1000);
        } else if (oneWaveParam) {
          (async () => await onewaveAuth())();
        }
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
        <DesktopScreen assets={assets} />
      ) : (
        <Launcher
          isTelegram={isTelegram}
          handleUpdateIdx={handleUpdateIdx}
          activeIndex={activeIndex}
        />
      )}
    </div>
  );
};

export default IntroPage;
