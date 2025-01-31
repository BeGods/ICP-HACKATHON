import React, { useEffect, useState } from "react";
import { RorContext } from "../../context/context";
import { fetchGameStats } from "../../utils/api.ror";
import { getRandomColor } from "../../helpers/randomColor.helper";
import {
  fetchHapticStatus,
  validateAuth,
  validateLang,
  validateSoundCookie,
} from "../../helpers/cookie.helper";
import i18next from "i18next";
import { getDeviceAndOS, trackEvent } from "../../utils/ga";
import RoRLoader from "../../components/Loaders/RoRLoader";
import Footer from "../../components/Common/RoRFooter";
import assets from "../../assets/assets.json";
import Citadel from "../ror/Citadel";
import RoRHeader from "../../components/ror/RoRHeader";
import Explore from "../ror/Explore";
import Leaderboard from "../ror/Leaderboard/Page";
import Bag from "../ror/Bag";
import Vault from "../ror/Vault";
import Blacksmith from "../ror/Blacksmith";
import Merchant from "../ror/Merchant";
import Profile from "../ror/Profile/Page";

const tele = window.Telegram?.WebApp;

const RoRMain = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showCard, setShowCard] = useState(null);
  const [enableSound, setEnableSound] = useState(true);
  const [enableHaptic, setEnableHaptic] = useState(true);
  const [userData, setUserData] = useState(null);
  const [activeMyth, setActiveMyth] = useState(0);
  const [platform, setPlatform] = useState(null);
  const [authToken, setAuthToken] = useState(0);
  const [section, setSection] = useState(7);
  const [minimize, setMinimize] = useState(0);
  const [country, setCountry] = useState(null);
  const [socialQuestData, setSocialQuestData] = useState([]);
  const [lang, setLang] = useState(null);
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
    setSwipes,
    socialQuestData,
    setSocialQuestData,
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
    // <Citadel />, // 0
    // <Explore />, // 1
    // <Bag />, // 2
    // <Profile />, //3
    // <Vault />, // 4
    // <Blacksmith />, // 5
    // <Merchant />, // 6
    // <Gacha />, // 7
  ];

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
      setSocialQuestData(response.quests);
      setSection(0);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  // set initial cookies
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

  // useEffect(() => {
  //   if (lang && authToken) {
  //     (async () => await getPartnersData())();
  //   }
  // }, [lang, authToken]);

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
      document.body.style.top = 0;
      document.body.style.bottom = 0;
      document.body.style.left = 0;
      document.body.style.right = 0;
      document.body.style.overflow = "hidden";
    }
  }, [platform]);

  return (
    <RorContext.Provider value={contextValues}>
      <div>
        {!isLoading ? (
          <div
            style={{
              backgroundImage: `url(${assets.uxui.basebg})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
            className="h-screen w-screen flex flex-col bg-white select-none font-fof"
          >
            {section !== 6 && section !== 7 && <RoRHeader />}
            <div className={`flex-grow flex pt-[7vh]`}>{sections[section]}</div>
            {section !== 7 && <Footer />}

            {showCard && (
              <div className="absolute z-50 h-screen w-screen">{showCard}</div>
            )}
          </div>
        ) : (
          <RoRLoader />
        )}
      </div>
    </RorContext.Provider>
  );
};

export default RoRMain;
