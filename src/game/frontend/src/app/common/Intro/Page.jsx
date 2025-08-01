import React, { useContext, useEffect, useRef, useState } from "react";
import {
  authenticateLine,
  authenticateOneWave,
  authenticateTg,
  refreshAuthToken,
} from "../../../utils/api.fof";
import {
  deleteAuthCookie,
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
import { MainContext } from "../../../context/context";
import i18next from "i18next";
import { getRandomColor } from "../../../helpers/randomColor.helper";
import { showToast } from "../../../components/Toast/Toast";
import {
  determineIsTelegram,
  determineIsTgDesktop,
} from "../../../utils/device.info";
import { useLocation } from "react-router-dom";
import liff from "@line/liff";
import { validate as isValidUUID } from "uuid";
import AppLayout from "../../../components/Layouts/AppLayout";
import OnboardPage from "../Auth/Page";

const tele = window.Telegram?.WebApp;

const IntroPage = (props) => {
  const {
    setEnableHaptic,
    enableSound,
    setEnableSound,
    platform,
    setPlatform,
    setAuthToken,
    setCountry,
    isTelegram,
    setIsTelegram,
    setIsBrowser,
    isBrowser,
    isTgMobile,
    setIsTgMobile,
  } = useContext(MainContext);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const oneWaveParam =
    isValidUUID(queryParams.get("onewave")) && queryParams.get("onewave");
  const refer = queryParams.get("refer");
  const [tokenExpired, setTokenExpired] = useState(false);
  const [tgUserData, setTgUserData] = useState(null);
  const [referralCode, setReferralCode] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const lineCalledRef = useRef(false);
  const onewaveCalledRef = useRef(false);

  // configure tma.auth
  const getUserData = async () => {
    if (tele) {
      try {
        await tele.ready();

        const { user } = tele.initDataUnsafe || {};
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
    let isReferLink = refer?.includes("FDG");
    let referrer = isReferLink ? refer : null;
    if (!lineCalledRef.current) {
      lineCalledRef.current = true;

      try {
        console.log("Authenticating with LINE...");
        const response = await authenticateLine(idToken, null, referrer);
        setAuthToken(response.data.accessToken);
        await setAuthCookie(tele, response.data.accessToken);
        console.log("LINE Authentication successful!");
      } catch (error) {
        console.error("Authentication Error: ", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRefreshToken = async () => {
    try {
      const response = await refreshAuthToken();
      const newToken = response.data.accessToken;
      console.log("new token via refresh: ", response);

      setAuthToken(newToken);
      await setAuthCookie(tele, newToken);
      return newToken;
    } catch (error) {
      await deleteAuthCookie();
      await handleAuth(isTelegram);
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
        const lang = liff.getAppLanguage();
        const shortLang = lang.split("-")[0];
        i18next.changeLanguage(shortLang);
        setLangCookie(tele, shortLang);
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

  const checkTokenExpiry = async () => {
    const tokenExpiry = await getExpCookie(tele);
    if (!tokenExpiry || tokenExpiry <= Date.now()) {
      setTokenExpired(true);
      return true;
    }
    return false;
  };

  const isExistingTknValid = async (tokenExp) => {
    try {
      console.log("checking token exists");
      const now = Date.now();
      let timeLeft = tokenExp - now;

      let token;
      if (timeLeft <= 0) {
        token = await handleRefreshToken();

        if (!token) {
          throw new Error("Token refresh failed, no new token received");
        }

        timeLeft = (await getExpCookie(tele)) - Date.now();
      } else {
        token = await validateAuth(tele);

        if (!token) {
          throw new Error("Token validation failed");
        }

        setAuthToken(token);
      }
    } catch (error) {
      console.error("Error inside isExistingTknValid:", error);
      throw error;
    }
  };

  useEffect(() => {
    getUserData();
    checkTokenExpiry();
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
    if (isTg) {
      await telegramAuth();
    } else if (liff.isInClient()) {
      setPlatform("line");
      await initalizeLine();
    } else if (oneWaveParam) {
      setPlatform("onewave");
      await onewaveAuth();
    }
  };

  useEffect(() => {
    if (platform) {
      const isTg = determineIsTelegram(platform); //  tg mobile
      const validtgDesktop = determineIsTgDesktop(platform); //  tg mobile

      if (isTg && !validtgDesktop) {
        setIsTgMobile(true);
      }

      {
        (async () => {
          setIsTelegram(isTg);

          const isUnknownBrowser =
            platform === "unknown" && !oneWaveParam && !liff.isInClient();

          if (isUnknownBrowser) {
            setIsBrowser(true);
            return;
          }

          setIsBrowser(false);

          const tokenExpiry = await getExpCookie(tele);
          await handleAuth(isTg);

          if (!tokenExpiry) {
            await handleAuth(isTg);
          } else {
            try {
              await isExistingTknValid(tokenExpiry);
            } catch (error) {
              if (error?.status === 401 || error?.response?.status === 401) {
                console.warn(
                  "Refresh token expired or invalid. Re-authenticating..."
                );
                await handleAuth(isTg);
              } else {
                console.error(
                  "Unexpected validation error. Re-authenticating..."
                );
                await handleAuth(isTg);
              }
            }
          }
        })();
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

  useEffect(() => {
    function isIframe() {
      return window.self !== window.top;
    }

    function isMobile() {
      return /Mobi|Android|iPhone|iPad/.test(navigator.userAgent);
    }

    if (isIframe() && isMobile()) {
      document.body.classList.add("iframe-mobile");
    }
  }, []);

  return (
    <AppLayout>
      <div className={`h-full  ${activeIndex == 2 ? "bg-white" : "bg-black"}`}>
        {isBrowser && tokenExpired ? (
          <OnboardPage
            handleTokenUpdated={() => {
              setTokenExpired(false);
            }}
            refer={refer || null}
          />
        ) : (
          <Launcher
            isLoading={isLoading}
            enableSound={enableSound}
            isTgMobile={isTgMobile}
            handleUpdateIdx={handleUpdateIdx}
            activeIndex={activeIndex}
          />
        )}
      </div>
    </AppLayout>
  );
};

export default IntroPage;
