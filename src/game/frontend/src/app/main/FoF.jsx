import { useContext, useEffect, useRef, useState } from "react";
import {
  claimStreakBonus,
  fetchGameStats,
  fetchProfilePhoto,
  fetchRewards,
  refreshAuthToken,
} from "../../utils/api.fof";
import { FofContext, MainContext } from "../../context/context";
import Quests from "../fof/Quest/Page";
import Profile from "../common/Profile/Page";
import Boosters from "../fof/Booster/Page";
import Leaderboard from "../fof/Leaderboard/Page";
import Forges from "../fof/Forge/Page";
import Tower from "../fof/Tower/Page";
import JoinBonus from "../fof/Bonus/Join/Page";
import Redeem from "../common/Vouchers/Page";
import Footer from "../../components/Layouts/Footer";
import Gift from "../common/Missions/Page";
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
import Announcement from "../common/Announcement/Page";
import FoFLoader from "../../components/Loaders/FoFLoader";
import i18next from "i18next";
import { getRandomColor } from "../../helpers/randomColor.helper";
import {
  determineIsTelegram,
  determineIsTgDesktop,
  isDesktop,
} from "../../utils/device.info";
import { useNavigate } from "react-router-dom";
import Notification from "../common/Notification/Page";
import AppLayout from "../../components/Layouts/AppLayout";
import StreakBonus from "../fof/Bonus/Streak/Page";
import Gacha from "../fof/Bonus/Daily/Page";

const tele = window.Telegram?.WebApp;

const FoFMain = () => {
  const navigate = useNavigate();
  const {
    assets,
    enableHaptic,
    setEnableHaptic,
    enableSound,
    setEnableSound,
    userData,
    setUserData,
    platform,
    authToken,
    setAuthToken,
    country,
    setCountry,
    lang,
    tasks,
    setTasks,
    isTelegram,
    setLineWallet,
    setPlatform,
    setIsTelegram,
    setGlobalRewards,
    setIsBrowser,
    isBrowser,
    isTgMobile,
    setIsTgMobile,
    tokens,
    setTokens,
    payouts,
    setPayouts,
    activeReward,
    setActiveReward,
    showBack,
    setShowBack,
    section,
    setSection,
    showCard,
    setShowCard,
    minimize,
    setMinimize,
    activeMyth,
    setActiveMyth,
  } = useContext(MainContext);
  const [isLoading, setIsLoading] = useState(true);
  const [gameData, setGameData] = useState(null);
  const [questsData, setQuestsData] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [triggerConf, setTriggerConf] = useState(false);
  const [keysData, setKeysData] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [rewardsClaimedInLastHr, setRewardsClaimedInLastHr] = useState(null);
  const [showAnmt, setShowAnmt] = useState(false);
  const [showBooster, setShowBooster] = useState(null);
  const refreshTimeoutRef = useRef();

  const initalStates = {
    gameData,
    setGameData,
    questsData,
    setQuestsData,
    userData,
    setUserData,
    section,
    setSection,
    activeMyth,
    setActiveMyth,
    showBooster,
    setShowBooster,
    platform,
    authToken,
    keysData,
    setKeysData,
    tasks,
    setTasks,
    rewards,
    setRewards,
    activeReward,
    setActiveReward,
    setRewardsClaimedInLastHr,
    rewardsClaimedInLastHr,
    enableSound,
    setEnableSound,
    minimize,
    setMinimize,
    setShowCard,
    assets,
    country,
    setCountry,
    triggerConf,
    setTriggerConf,
    enableHaptic,
    setEnableHaptic,
    setShowAnmt,
    showAnmt,
    leaderboard,
    setLeaderboard,
    isTelegram,
    setLineWallet,
    setIsBrowser,
    isBrowser,
    isTgMobile,
    setIsTgMobile,
    tokens,
    setTokens,
    payouts,
    setPayouts,
    showBack,
    setShowBack,
    showCard,
  };
  const sections = [
    <Forges />, // 0
    <Quests />, // 1
    <Boosters />, // 2
    <Profile />, // 3
    <Tower />, // 4
    <Gift />, // 5
    <Redeem />, // 6
    <Leaderboard />, // 7
    <Gacha />, // 8
    <JoinBonus />, // 9
    <StreakBonus />, // 10
    <Announcement />, // 11
    <Notification />, //12
  ];

  const getProfilePhoto = async (token) => {
    try {
      const response = await fetchProfilePhoto(token);
      if (response.avatarUrl) {
        setUserData((prev) => ({
          ...prev,
          avatarUrl: response.avatarUrl,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getStreakBonus = async (token) => {
    try {
      const response = await claimStreakBonus(token);
      setGameData((prevData) => {
        const updatedData = {
          ...prevData,
          mythologies: prevData.mythologies.map((item) =>
            item.name === response.mythology
              ? {
                  ...item,
                  boosters: response.boosterUpdatedData,
                }
              : item
          ),
        };

        return updatedData;
      });
      setUserData((prev) => ({
        ...prev,
        streak: {
          ...prev.streak,
          lastMythClaimed: response.mythology,
        },
      }));
      trackEvent("rewards", "claim_streak_reward", "success");
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      setSection(10);
    } catch (error) {
      console.log(error);
      showToast("default");
    }
  };

  // fetch all game data
  const getGameData = async (token) => {
    const response = await fetchGameStats(token);

    setGameData(response?.stats);
    setQuestsData(response?.quests);
    setTasks(response?.extraQuests);
    setCountry(response?.user.country);
    setUserData(response?.user);
    setKeysData(response?.towerKeys);
    setTokens(response?.tokens);

    if (response?.user?.streak?.isStreakActive) {
      await getStreakBonus(token);
    } else if (!response?.user?.joiningBonus) {
      setSection(9);
      setTimeout(() => setIsLoading(false), 1000);
      if (isTelegram) await getProfilePhoto(token);
    } else if (
      response?.user?.joiningBonus &&
      response?.user.isEligibleToClaim
    ) {
      setSection(8);
      setTimeout(() => setIsLoading(false), 1000);
    } else {
      setSection(0);
      setTimeout(() => setIsLoading(false), 1000);
    }
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
          <FofContext.Provider value={initalStates}>
            <div>{sections[section]}</div>
            {section != 7 &&
              section != 10 &&
              section != 9 &&
              section != 8 &&
              section != 11 &&
              section != 5 &&
              section != 12 &&
              section != 1 &&
              !showCard && <Footer />}
            {showCard && showCard}
          </FofContext.Provider>
        </div>
      ) : (
        <FoFLoader />
      )}
    </AppLayout>
  );
};

export default FoFMain;
