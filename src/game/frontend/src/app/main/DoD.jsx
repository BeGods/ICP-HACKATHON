import { useEffect, useRef, useState } from "react";
import {
  fetchProfilePhoto,
  fetchRewards,
  refreshAuthToken,
} from "../../utils/api.fof";
import { showToast } from "../../components/Toast/Toast";
import {
  deleteAuthCookie,
  fetchHapticStatus,
  getExpCookie,
  setAuthCookie,
  validateAuth,
  validateCountryCode,
  validateLang,
  validateSoundCookie,
} from "../../helpers/cookie.helper";
import { getDeviceAndOS, trackEvent } from "../../utils/ga";
import i18next from "i18next";
import { getRandomColor } from "../../helpers/randomColor.helper";
import {
  determineIsTelegram,
  determineIsTgDesktop,
  isDesktop,
} from "../../utils/device.info";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/Layouts/AppLayout";
import { useStore } from "../../store/useStore";
import Battle from "../dod/Battle";
import DoDLoader from "../../components/Loaders/DoDLoader";
import Home from "../dod/Home";
import { fetchGameStats } from "../../utils/api.dod";
import UpdateDeck from "../dod/UpdateDeck";

const tele = window.Telegram?.WebApp;

const DoDMain = () => {
  const navigate = useNavigate();
  const refreshTimeoutRef = useRef();
  const setEnableHaptic = useStore((s) => s.setEnableHaptic);
  const setEnableSound = useStore((s) => s.setEnableSound);
  const setUserData = useStore((s) => s.setUserData);
  const platform = useStore((s) => s.platform);
  const setPlatform = useStore((s) => s.setPlatform);
  const setAuthToken = useStore((s) => s.setAuthToken);
  const country = useStore((s) => s.country);
  const setCountry = useStore((s) => s.setCountry);
  const lang = useStore((s) => s.lang);
  const setTasks = useStore((s) => s.setTasks);
  const setIsTelegram = useStore((s) => s.setIsTelegram);
  const setGlobalRewards = useStore((s) => s.setGlobalRewards);
  const setIsBrowser = useStore((s) => s.setIsBrowser);
  const setIsTgMobile = useStore((s) => s.setIsTgMobile);
  const setTokens = useStore((s) => s.setTokens);
  const setPayouts = useStore((s) => s.setPayouts);
  const section = useStore((s) => s.section);
  const setSection = useStore((s) => s.setSection);
  const showCard = useStore((s) => s.showCard);
  const setGameData = useStore((s) => s.setGameData);
  const setGameStats = useStore((s) => s.setGameStats);
  const setRewards = useStore((s) => s.setRewards);
  const setRewardsClaimedInLastHr = useStore(
    (s) => s.setRewardsClaimedInLastHr
  );
  const [isLoading, setIsLoading] = useState(true);

  const sections = [<Home />, <Battle />, <UpdateDeck />];

  // fetch all game data
  const getGameData = async (token) => {
    const response = await fetchGameStats(token);

    setGameStats(response?.stats);
    setGameData(response?.game);
    setTasks(response?.tasks);
    setCountry(response?.user.country);
    setUserData(response?.user);
    setTokens(response?.tokens);

    if (response.game.characterCardDeck?.length === 0) {
      setSection(2);
    } else if (response.game.gamePhase === "idle") {
      setSection(0);
    } else {
      setSection(1);
    }

    setTimeout(() => setIsLoading(false), 1000);
  };

  const getPartnersData = async (token) => {
    const rewardsData = await fetchRewards(lang, country, token);
    setRewards([...rewardsData?.vouchers, ...rewardsData?.claimedRewards]);
    setGlobalRewards([
      ...rewardsData?.vouchers,
      ...rewardsData?.claimedRewards,
    ]);
    setRewardsClaimedInLastHr(rewardsData?.rewardsClaimedInLastHr);
    setPayouts([...rewardsData?.payouts]);
    localStorage.setItem("bubbleLastClaimed", rewardsData?.bubbleLastClaimed);
  };

  const initializeGame = async () => {
    try {
      const tokenExp = await getExpCookie(tele);
      const now = Date.now();
      let timeLeft = tokenExp - now;
      let token;

      if (timeLeft <= 0) {
        token = await handleRefreshToken();
        timeLeft = (await getExpCookie(tele)) - Date.now();
      } else {
        token = await validateAuth(tele);
      }

      if (token) {
        setAuthToken(token);

        try {
          await getGameData(token);
          await getPartnersData(token);
        } catch (err) {
          if (err?.response?.status === 401) {
            await deleteAuthCookie(tele);
            console.error("Unauthorized. Auth cookie deleted.");
          } else {
            console.error("Error during game init:", err);
          }
          showToast("default");
        }

        refreshTimeoutRef.current = setTimeout(async () => {
          await handleRefreshToken();
        }, timeLeft - 10000);
      }
    } catch (error) {
      console.error("Initialization error:", error);
      showToast("default");
    }
  };

  const handleRefreshToken = async () => {
    try {
      const response = await refreshAuthToken();
      const newToken = response.data.accessToken;
      clearTimeout(refreshTimeoutRef.current);
      refreshTimeoutRef.current = null;
      setAuthToken(newToken);
      await setAuthCookie(tele, newToken);
      setSection(0);
    } catch (error) {
      showToast("default");
      navigate("/");
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
      const existingAddr = sessionStorage.getItem("accountAddress");
      // if (existingAddr) {
      //   setLineWallet(existingAddr);
      // }
    } catch (error) {
      showToast("default");
    }
  };

  useEffect(() => {
    syncAllCookies();
    initializeGame();
  }, []);

  useEffect(() => {
    if (tele) {
      tele.setHeaderColor("#000000");
      tele.setBackgroundColor("#000000");
      tele.setBottomBarColor("#000000");
      setPlatform(tele.platform);
      const isTg = determineIsTelegram(tele.platform);
      const validtgDesktop = determineIsTgDesktop(platform);

      if (isTg && !validtgDesktop) {
        setIsTgMobile(true);
      }
      setIsTelegram(isTg);
    }
  }, []);

  useEffect(() => {
    if (platform === "ios") {
      document.body.style.position = "fixed";
      document.body.style.top = `calc(var(--tg-safe-area-inset-top) + 45px)`;
      document.body.style.bottom = "0";
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.overflow = "hidden";
    }

    const isBrowserDesktop = isDesktop();
    setIsBrowser(isBrowserDesktop);
  }, [platform]);

  return (
    <AppLayout>
      {!isLoading ? (
        <div className={`w-screen h-full select-none font-fof`}>
          <div>{sections[section]}</div>
          {showCard && showCard}
        </div>
      ) : (
        <DoDLoader />
      )}
    </AppLayout>
  );
};

export default DoDMain;
