import { useContext, useEffect, useRef, useState } from "react";
import { MainContext, RorContext } from "../../context/context";
import { fetchGameStats } from "../../utils/api.ror";
import { getRandomColor } from "../../helpers/randomColor.helper";
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
import i18next from "i18next";
import { getDeviceAndOS, trackEvent } from "../../utils/ga";
import RoRLoader from "../../components/Loaders/RoRLoader";
import Citadel from "../ror/Citadel/Citadel";
import Explore from "../ror/Explore";
import Leaderboard from "../ror/Leaderboard/Page";
import Inventory from "../ror/Inventory";
import Furnace from "../ror/Furnace";
import {
  fetchProfilePhoto,
  fetchRewards,
  refreshAuthToken,
} from "../../utils/api.fof";
import Profile from "../common/Profile/Page";
import Gacha from "../ror/Bonus/Daily";
import {
  determineIsTelegram,
  determineIsTgDesktop,
  isDesktop,
} from "../../utils/device.info";
import JoinBonus from "../ror/Bonus/Join";
import Library from "../ror/Library";
import Tavern from "../ror/Tavern";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../components/Toast/Toast";
import Apothecary from "../ror/Apothecary";
import Bank from "../ror/Bank";
import Gift from "../common/Missions/Page";
import Redeem from "../common/Vouchers/Page";
import AppLayout from "../../components/Layouts/AppLayout";
import Footer from "../../components/Layouts/Footer";
import Notification from "../common/Notification/Page";

const tele = window.Telegram?.WebApp;

const RoRMain = () => {
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
    game,
    globalRewards,
    setGlobalRewards,
    setIsTelegram,
    setPlatform,
    triggerConf,
    setTriggerConf,
    activeReward,
    setActiveReward,
    isBrowser,
    setIsBrowser,
    isTgMobile,
    setIsTgMobile,
    payouts,
    setPayouts,
    minimize,
    setMinimize,
    activeMyth,
    setActiveMyth,
    section,
    setSection,
    showCard,
    setShowCard,
  } = useContext(MainContext);
  const [mythBg, setMythBg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rewards, setRewards] = useState([]);
  const [swipes, setSwipes] = useState(0);
  const [shiftBg, setShiftBg] = useState(50);
  const [isSwiping, setIsSwiping] = useState(false);
  const [shardReward, setShardReward] = useState(null);
  const [rewardsClaimedInLastHr, setRewardsClaimedInLastHr] = useState(null);
  const [battleData, setBattleData] = useState({
    currentRound: 1,
    roundData: [],
  });
  const [gameData, setGameData] = useState({
    stats: null,
    bag: null,
    bank: null,
    pouch: null,
    claimedItems: null,
    builder: null,
  });
  const contextValues = {
    enableHaptic,
    lang,
    country,
    section,
    setSection,
    activeMyth,
    setActiveMyth,
    assets,
    platform,
    authToken,
    enableSound,
    userData,
    gameData,
    setGameData,
    showCard,
    setShowCard,
    minimize,
    setMinimize,
    battleData,
    setBattleData,
    swipes,
    rewards,
    setRewards,
    setRewardsClaimedInLastHr,
    rewardsClaimedInLastHr,
    setSwipes,
    tasks,
    setTasks,
    isTelegram,
    game,
    globalRewards,
    setGlobalRewards,
    setShiftBg,
    shardReward,
    setShardReward,
    triggerConf,
    setTriggerConf,
    activeReward,
    setActiveReward,
    isSwiping,
    setIsSwiping,
    isBrowser,
    setIsBrowser,
    isTgMobile,
    setIsTgMobile,
    payouts,
    setPayouts,
    mythBg,
    setMythBg,
  };
  const refreshTimeoutRef = useRef();

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

  // fetch all game data
  const getGameData = async (token) => {
    const response = await fetchGameStats(token);
    setUserData(response.user);
    setGameData({
      stats: response.stats,
      bag: response.bag,
      bank: response.bank,
      pouch: response.pouch,
      claimedItems: response.claimedItems,
      builder: response.builder,
    });
    setTasks(response.quests);
    setSwipes(response?.stats?.digLvl ?? 1 ?? 1);

    if (!response.user?.joiningBonus) {
      setSection(12);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      if (isTelegram) {
        (async () => {
          await getProfilePhoto(token);
        })();
      }
    } else if (response.user.isEligibleToClaim) {
      setTimeout(() => {
        setSection(11);
        setIsLoading(false);
      }, 1000);
    } else {
      setTimeout(() => {
        setSection(0);
        setIsLoading(false);
      }, 1000);
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const getPartnersData = async (token) => {
    const rewardsData = await fetchRewards(lang, country, token);
    setRewards([...rewardsData.vouchers, ...rewardsData.claimedRewards]);
    setGlobalRewards([...rewardsData.vouchers, ...rewardsData.claimedRewards]);
    setRewardsClaimedInLastHr(rewardsData.rewardsClaimedInLastHr);
    setPayouts([...rewardsData.payouts]);
    localStorage.setItem("bubbleLastClaimed", rewardsData.bubbleLastClaimed);
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
    } catch (error) {
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
    document.documentElement.style.setProperty(
      "--card-height",
      isTelegram ? "45.35vh" : "90vh"
    );
  }, [isTelegram]);

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

  const sections = [
    <Citadel />, // 0
    <Explore />, // 1
    <Inventory />, // 2
    <Furnace />, //  3
    <Bank />, // 4
    <Apothecary />, // 5
    <Library />, // 6
    <Tavern />, // 7
    <Profile />, // 8
    <Leaderboard />, // 9
    <Gift />, // 10
    <Gacha />, // 11
    <JoinBonus />, // 12
    <Redeem />, //  13
    <Notification />, //14
  ];

  useEffect(() => {
    setShiftBg(50);
  }, [section]);

  return (
    <AppLayout>
      {!isLoading ? (
        <div className={`w-screen h-full select-none font-fof`}>
          <RorContext.Provider value={contextValues}>
            <div>{sections[section]}</div>
            {section !== 14 &&
              section !== 13 &&
              section !== 12 &&
              section !== 11 &&
              section !== 15 &&
              section !== 10 && <Footer />}
            {showCard && showCard}
          </RorContext.Provider>
        </div>
      ) : (
        <RoRLoader />
      )}
    </AppLayout>
  );
};

export default RoRMain;
