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
import Footer from "../../components/Layouts/RoRFooter";
import Citadel from "../ror/Citadel";
import Explore from "../ror/Explore";
import Leaderboard from "../ror/Leaderboard/Page";
import Bag from "../ror/Bag";
import Vault from "../ror/Vault";
import Blacksmith from "../ror/Blacksmith";
import SettingModal from "../../components/Modals/Settings";
import TgHeader from "../../components/Layouts/TgHeader";
import {
  fetchProfilePhoto,
  fetchRewards,
  refreshAuthToken,
} from "../../utils/api.fof";
import Profile from "../common/Profile/Page";
import Gift from "../common/Gift/Gift";
import Gacha from "../ror/Gacha";
import {
  determineIsTelegram,
  determineIsTgDesktop,
  isDesktop,
} from "../../utils/device.info";
import JoinBonus from "../ror/JoinBonus";
import Library from "../ror/Library";
import Tavern from "../ror/Tavern";
import Redeem from "../common/Redeem/Redeem";
import OnboardPage from "../fof/Onboard/Page";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../components/Toast/Toast";
import Apothecary from "../ror/Apothecary";
import Bank from "../ror/Bank";

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
  } = useContext(MainContext);
  const [isLoading, setIsLoading] = useState(true);
  const [showCard, setShowCard] = useState(null);
  const [activeMyth, setActiveMyth] = useState(0);
  const [section, setSection] = useState(7);
  const [minimize, setMinimize] = useState(0);
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
      setSection(10);
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
        setSection(9);
        setIsLoading(false);
      }, 1000);
    } else {
      setTimeout(() => {
        setSection(1);
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
    <Bag />, // 2
    <Blacksmith />, //  3
    <Bank />, // 4
    <Vault />, // 5
    <Profile />, // 6
    <Leaderboard />, // 7
    <Gift />, // 8
    <Gacha />, // 9
    <JoinBonus />, // 10
    <Apothecary />, // 11
    <Library />, // 12,
    <Tavern />, // 13
    <Redeem />, //  14
    <OnboardPage />, // 15
  ];

  const bgs = {
    0: assets.locations.citadel,
    1: assets.uxui.baseBgA,
    2: assets.uxui.baseBgA,
    3: assets.locations.foundry,
    4: assets.locations.bank,
    5: assets.locations.bank,
    6: assets.uxui.baseBgA,
    7: assets.uxui.baseBgA,
    8: assets.uxui.baseBgA,
    9: assets.uxui.baseBgA,
    10: assets.uxui.baseBgA,
    10: assets.uxui.baseBgA,
    11: assets.locations.apothecary,
    12: assets.locations.library,
    13: assets.locations.tavern,
  };

  useEffect(() => {
    setShiftBg(50);
  }, [section]);

  return (
    <div>
      <TgHeader
        openSettings={() => {
          setShowCard(
            <SettingModal
              close={() => {
                setShowCard(null);
              }}
            />
          );
        }}
      />

      {!isLoading ? (
        <div
          style={{
            backgroundImage: `url(${bgs[section]})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: `${shiftBg}%`,
          }}
          className={`w-screen transition-all duration-75 ${
            isTgMobile ? "tg-container-height" : "browser-container-height"
          } bg-white select-none font-fof overflow-hidden`}
        >
          <RorContext.Provider value={contextValues}>
            <div className={`flex-grow flex`}>{sections[section]}</div>
            {section !== 7 && section !== 9 && section !== 10 && <Footer />}
            {showCard && (
              <div className="absolute z-[99] w-screen">{showCard}</div>
            )}
          </RorContext.Provider>
        </div>
      ) : (
        <RoRLoader />
      )}
    </div>
  );
};

export default RoRMain;
