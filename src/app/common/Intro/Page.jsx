import React, { useContext, useEffect, useRef, useState } from "react";
import {
  authenticateLine,
  authenticateOneWave,
  authenticateTg,
  refreshAuthToken,
} from "../../../utils/api.fof";
import {
  fetchHapticStatus,
  getExpCookie,
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
import { determineIsTelegram } from "../../../utils/device.info";
import { useLocation } from "react-router-dom";
import liff from "@line/liff";
import { v4 as uuidv4 } from "uuid";
import OnboardPage from "../../fof/Onboard/Page";

const tele = window.Telegram?.WebApp;

const IntroPage = (props) => {
  const {
    assets,
    setEnableHaptic,
    enableSound,
    setEnableSound,
    platform,
    setPlatform,
    setAuthToken,
    setCountry,
    isTelegram,
    setIsTelegram,
  } = useContext(MainContext);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const oneWaveParam = queryParams.get("onewave");
  const refer = queryParams.get("refer");
  const [tgUserData, setTgUserData] = useState(null);
  const [referralCode, setReferralCode] = useState(null);
  const [disableDesktop, setDisableDestop] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const lineCalledRef = useRef(false);
  const onewaveCalledRef = useRef(false);

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
      setAuthToken(response.data.accessToken);
      await setAuthCookie(tele, response.data.accessToken);
    } catch (error) {
      console.error("Authentication Error: ", error);
    }
  };

  const lineAuth = async (idToken) => {
    if (!lineCalledRef.current) {
      lineCalledRef.current = true;
      try {
        const response = await authenticateLine(idToken);
        setAuthToken(response.data.accessToken);
        await setAuthCookie(tele, response.data.accessToken);
      } catch (error) {
        console.error("Authentication Error: ", error);
      }
    }
  };

  const handleRefreshToken = async () => {
    try {
      const response = await refreshAuthToken();
      const newToken = response.data.accessToken;
      setAuthToken(newToken);
      await setAuthCookie(tele, newToken);
    } catch (error) {
      console.log(error);
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

  const initalizeLine = async () => {
    liff
      .init({
        liffId: import.meta.env.VITE_LINE_ID,
      })
      .then(async () => {
        const idToken = liff.getIDToken();
        await lineAuth(idToken);
      });
  };

  const onewaveAuth = async () => {
    if (!onewaveCalledRef.current) {
      onewaveCalledRef.current = true;
      try {
        const response = await authenticateOneWave(oneWaveParam);
        setAuthToken(response.data.accessToken);
        await setAuthCookie(tele, response.data.accessToken);
      } catch (error) {
        console.error("Authentication Error: ", error);
      }
    }
  };

  const isExistingTknValid = async (tokenExp) => {
    try {
      console.log("Validating existing token...");
      const now = Date.now();
      let timeLeft = tokenExp - now;

      let token;
      if (timeLeft <= 0) {
        console.log("Token expired, attempting refresh...");
        token = await handleRefreshToken();

        if (!token) {
          throw new Error("Token refresh failed, no new token received");
        }

        timeLeft = (await getExpCookie(tele)) - Date.now();
      } else {
        console.log("Token still valid, verifying auth...");
        token = await validateAuth(tele);

        if (!token) {
          throw new Error("Token validation failed");
        }

        setAuthToken(token);
      }
    } catch (error) {
      console.error("Error inside isExistingTknValid:", error);

      // Explicitly rethrow the error
      throw error;
    }
  };

  useEffect(() => {
    getUserData();
    syncAllCookies();

    const handleUserInteraction = () => {
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

  const handleAuth = async (isTg) => {
    console.log("Yes handleAuth was called", isTg);

    if (isTg) {
      setTimeout(() => telegramAuth(), 1000);
    } else if (liff.isInClient()) {
      setPlatform("line");
      setTimeout(() => initalizeLine(), 1000);
    } else if (oneWaveParam) {
      setPlatform("onewave");
      setTimeout(() => onewaveAuth(), 1000);
    }
  };

  useEffect(() => {
    if (platform) {
      const isTg = determineIsTelegram(platform);

      (async () => {
        const tokenExpiry = await getExpCookie(tele);
        setIsTelegram(isTg);

        if (
          platform === "macos" ||
          platform === "windows" ||
          platform === "tdesktop" ||
          platform === "web" ||
          platform === "weba" ||
          (platform === "unknown" && !oneWaveParam && !liff.isInClient())
        ) {
          setDisableDestop(true);
        } else {
          setDisableDestop(false);
          if (tokenExpiry) {
            try {
              console.log("Checking token validity...");
              await isExistingTknValid(tokenExpiry);
              console.log("Token is valid");
            } catch (error) {
              console.log("Yes error occurred bro", error); // This should now always log errors

              // Debugging: Check the error structure
              console.log("Error details:", JSON.stringify(error, null, 2));

              if (error?.status === 401 || error?.response?.status === 401) {
                console.warn("Refresh token expired, proceeding with login");
                await handleAuth(isTg);
              } else {
                console.warn(
                  "Unexpected error occurred, proceeding with login anyway"
                );
                await handleAuth(isTg);
              }
            }
          } else {
            await handleAuth();
          }
        }
      })();

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
      {disableDesktop && refer == "STAN" ? (
        <OnboardPage />
      ) : disableDesktop && refer !== "STAN" ? (
        <DesktopScreen assets={assets} />
      ) : (
        <Launcher
          enableSound={enableSound}
          isTelegram={isTelegram}
          handleUpdateIdx={handleUpdateIdx}
          activeIndex={activeIndex}
        />
      )}
    </div>
  );
};

export default IntroPage;
