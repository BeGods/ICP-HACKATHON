import React, { useEffect, useState } from "react";
import {
  claimStreakBonus,
  fetchGameStats,
  fetchProfilePhoto,
  fetchRewards,
} from "./utils/api";
import i18next from "i18next";
import { getRandomColor } from "./helpers/randomColor.helper";
import { MyContext } from "./context/context";
import Quests from "./pages/Quest/Page";
import Profile from "./pages/Profile/Page";
import Boosters from "./pages/Booster/Page";
import Leaderboard from "./pages/Leaderboard/Page";
import Loader from "./components/Common/Loader";
import Forges from "./pages/Forge/Page";
import Gacha from "./pages/Gacha/Page";
import Tower from "./pages/Tower/Page";
import JoinBonus from "./pages/JoinBonus/Page";
import Redeem from "./pages/Redeem/Redeem";
import Footer from "./components/Common/Footer";
import Gift from "./pages/Gift/Gift";
import assets from "./assets/assets.json";
import { showToast } from "./components/Toast/Toast";
import StreakBonus from "./pages/Streak/StreakBonus";
import {
  fetchHapticStatus,
  validateAuth,
  validateCountryCode,
  validateLang,
  validateSoundCookie,
  validateTutCookie,
} from "./helpers/cookie.helper";
import OnboardPage from "./pages/Onboard/Page";
import { getDeviceAndOS, trackEvent } from "./utils/ga";
import Announcement from "./pages/Announcement/Page";
import { Settings } from "lucide-react";
import SettingModal from "./components/Modals/Settings";

const tele = window.Telegram?.WebApp;

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showCard, setShowCard] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [questsData, setQuestsData] = useState(null);
  const [leaderboard, setLeaderboard] = useState(null);
  const [socialQuestData, setSocialQuestData] = useState(null);
  const [enableSound, setEnableSound] = useState(true);
  const [enableHaptic, setEnableHaptic] = useState(true);
  const [triggerConf, setTriggerConf] = useState(false);
  const [keysData, setKeysData] = useState(null);
  const [rewards, setRewards] = useState([]);
  const [rewardsClaimedInLastHr, setRewardsClaimedInLastHr] = useState(null);
  const [showAnmt, setShowAnmt] = useState(false);
  const [activeReward, setActiveReward] = useState(null);
  const [userData, setUserData] = useState(null);
  const [activeMyth, setActiveMyth] = useState(0);
  const [showBooster, setShowBooster] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [section, setSection] = useState(1);
  const [minimize, setMinimize] = useState(0);
  const [country, setCountry] = useState("NA");
  const [lang, setLang] = useState(null);
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
    socialQuestData,
    setSocialQuestData,
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
    <OnboardPage />, // 11
    <Announcement />, // 12
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

  const getPartnersData = async () => {
    try {
      const rewardsData = await fetchRewards(lang, country, authToken);
      setRewards([...rewardsData?.rewards, ...rewardsData?.claimedRewards]);
      setRewardsClaimedInLastHr(rewardsData?.rewardsClaimedInLastHr);
      localStorage.setItem("bubbleLastClaimed", rewardsData?.bubbleLastClaimed);
    } catch (error) {
      console.log(error);
      showToast("default");
    }
  };

  const getStreakBonus = async (token) => {
    try {
      const activeCountry = await validateCountryCode(tele);
      const rewardsData = await claimStreakBonus(token, activeCountry);
      trackEvent("rewards", "claim_streak_reward", "success");
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);

      if (rewardsData.reward === "fdg") {
        setSection(0);
      } else {
        setActiveReward(rewardsData.reward);
        setSection(10);
      }
    } catch (error) {
      console.log(error);
      showToast("default");
    }
  };

  // fetch all game data
  const getGameData = async (token) => {
    try {
      const response = await fetchGameStats(token);
      const showAnmnt = await validateTutCookie(tele, "announcement08");
      setGameData(response?.stats);
      setQuestsData(response?.quests);
      setSocialQuestData(response?.extraQuests);
      setCountry(response?.user.country);
      setUserData(response?.user);
      setKeysData(response?.towerKeys);
      if (!response?.user?.joiningBonus) {
        setSection(9);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        (async () => {
          await getProfilePhoto(token);
        })();
      } else if (
        response?.user?.joiningBonus &&
        response?.user.isEligibleToClaim
      ) {
        setSection(8);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      } else if (response?.user?.isStreakActive) {
        (async () => {
          await getStreakBonus(token);
        })();
      } else if (!showAnmnt) {
        setSection(12);
        setIsLoading(false);
      } else {
        setSection(0);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      showToast("default");
    }
  };

  const syncAllCookies = async () => {
    localStorage.setItem("avatarColor", getRandomColor());
    const currLang = await validateLang(tele);
    const isAuth = await validateAuth(tele);
    const isSoundActive = await validateSoundCookie(tele);
    const isHapticActive = await fetchHapticStatus(tele);

    i18next.changeLanguage(currLang);
    setEnableHaptic(isHapticActive);
    setLang(currLang);
    setEnableSound(JSON.parse(isSoundActive));
    setAuthToken(isAuth);

    const device = getDeviceAndOS(tele.platform);
    trackEvent("device", device, "success");

    if (isAuth) {
      (async () => await getGameData(isAuth))();
    } else {
      showToast("default");
    }
  };

  useEffect(() => {
    syncAllCookies();
  }, []);

  useEffect(() => {
    if (lang && authToken) {
      (async () => await getPartnersData())();
    }
  }, [lang, authToken]);

  useEffect(() => {
    if (tele) {
      tele.setHeaderColor("#000000");
      tele.setBackgroundColor("#000000");
      tele.setBottomBarColor("#000000");
      setPlatform(tele.platform);
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
  }, [platform]);

  return (
    <div>
      <div
        onClick={() => {
          setShowCard(
            <SettingModal
              close={() => {
                setShowCard(null);
              }}
            />
          );
        }}
        className="absolute -top-[35px] right-[94px] text-white z-5s0"
      >
        <Settings size={"6vw"} />
      </div>

      {!isLoading ? (
        <div
          className="w-screen bg-white select-none font-fof overflow-hidden"
          style={{
            height: `calc(100svh - var(--tg-safe-area-inset-top) - 45px)`,
          }}
        >
          <MyContext.Provider value={initalStates}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((item) => (
              <div key={item}>
                <>{section === item && sections[item]}</>
              </div>
            ))}
            {section != 7 &&
              section != 10 &&
              section != 9 &&
              section != 8 &&
              section != 12 &&
              section != 13 &&
              section != 11 && <Footer minimize={minimize} />}
            {showCard && (
              <div className="absolute z-[99] w-screen">{showCard}</div>
            )}
          </MyContext.Provider>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default Home;
