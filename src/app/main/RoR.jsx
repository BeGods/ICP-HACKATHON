import React, { useContext, useEffect, useState } from "react";
import { MainContext, RorContext } from "../../context/context";
import { fetchGameStats } from "../../utils/api.ror";
import { getRandomColor } from "../../helpers/randomColor.helper";
import {
  fetchHapticStatus,
  validateAuth,
  validateCountryCode,
  validateLang,
  validateSoundCookie,
} from "../../helpers/cookie.helper";
import i18next from "i18next";
import { getDeviceAndOS, trackEvent } from "../../utils/ga";
import RoRLoader from "../../components/Loaders/RoRLoader";
import Footer from "../../components/Common/RoRFooter";
import Citadel from "../ror/Citadel";
import Explore from "../ror/Explore";
import Leaderboard from "../ror/Leaderboard/Page";
import Bag from "../ror/Bag";
import Vault from "../ror/Vault";
import Blacksmith from "../ror/Blacksmith";
import Merchant from "../ror/Merchant";
import SettingModal from "../../components/Modals/Settings";
import TgHeader from "../../components/Common/TgHeader";
import { fetchRewards } from "../../utils/api.fof";
import Profile from "../fof/Profile/Page";
import RoRHeader from "../../components/layouts/Header";

const tele = window.Telegram?.WebApp;

const RoRMain = () => {
  const {
    assets,
    enableHaptic,
    setEnableHaptic,
    enableSound,
    setEnableSound,
    userData,
    setUserData,
    platform,
    setPlatform,
    authToken,
    setAuthToken,
    country,
    setCountry,
    lang,
    tasks,
    setTasks,
    isTelegram,
  } = useContext(MainContext);
  const [isLoading, setIsLoading] = useState(true);
  const [showCard, setShowCard] = useState(null);
  const [activeMyth, setActiveMyth] = useState(0);
  const [section, setSection] = useState(7);
  const [minimize, setMinimize] = useState(0);
  const [rewards, setRewards] = useState([]);
  const [swipes, setSwipes] = useState(0);
  const [battleData, setBattleData] = useState({
    currentRound: 1,
    roundData: [],
  });
  const [gameData, setGameData] = useState({
    stats: null,
    bag: null,
    bank: null,
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
    setShowCard,
    minimize,
    setMinimize,
    battleData,
    setBattleData,
    swipes,
    rewards,
    setRewards,
    setSwipes,
    tasks,
    setTasks,
    isTelegram,
  };

  const sections = [
    <Citadel />, // 0
    <Explore />, // 1
    <Bag />, // 2
    <Blacksmith />, //  3
    <Merchant />, // 4
    <Vault />, // 5
    <Profile />, // 6
    <Leaderboard />, // 7
  ];

  const getPartnersData = async (token) => {
    try {
      const rewardsData = await fetchRewards(lang, country, token);
      setRewards([...rewardsData?.rewards, ...rewardsData?.claimedRewards]);
    } catch (error) {
      console.log(error);
      showToast("default");
    }
  };

  // fetch all game data
  const getGameData = async (token) => {
    try {
      const response = await fetchGameStats(token);
      setUserData(response.user);
      setGameData((prev) => {
        return {
          stats: response.stats,
          bag: response.bag,
          bank: response.bank,
        };
      });
      setTasks(response.quests);
      setSection(0);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.log(error);
      showToast("default");
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
    } catch (error) {
      showToast("default");
    }
  };

  const initializeGame = async () => {
    try {
      const token = await validateAuth(tele);
      if (token) {
        setAuthToken(token);
        (async () => await getGameData(token))();
        (async () => await getPartnersData(token))();
      }
    } catch (error) {
      console.log(error);
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
            backgroundImage: `url(${assets.uxui.basebg})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
          className={`w-screen ${
            isTelegram ? "tg-container-height" : "browser-container-height"
          } bg-white select-none font-fof overflow-hidden`}
        >
          <RorContext.Provider value={contextValues}>
            <div className={`flex-grow flex pt-[7vh]`}>{sections[section]}</div>
            {section !== 7 && <Footer />}
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
