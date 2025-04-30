import React, { useContext, useEffect, useState } from "react";
import { MainContext, RorContext } from "../../context/context";
import { fetchGameStats } from "../../utils/api.ror";
import { getRandomColor } from "../../helpers/randomColor.helper";
import {
  deleteAuthCookie,
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
import { fetchProfilePhoto, fetchRewards } from "../../utils/api.fof";
import Profile from "../fof/Profile/Page";
import Gift from "../fof/Gift/Gift";
import Gacha from "../ror/Gacha";
import { determineIsTelegram } from "../../utils/device.info";
import JoinBonus from "../ror/JoinBonus";
import Potions from "../ror/Potions";
import Book from "../ror/Book";
import Tavern from "../ror/Tavern";

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
  } = useContext(MainContext);
  const [isLoading, setIsLoading] = useState(true);
  const [showCard, setShowCard] = useState(null);
  const [activeMyth, setActiveMyth] = useState(0);
  const [section, setSection] = useState(7);
  const [minimize, setMinimize] = useState(0);
  const [rewards, setRewards] = useState([]);
  const [swipes, setSwipes] = useState(0);
  const [shiftBg, setShiftBg] = useState(50);
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
  };

  const getPartnersData = async (token) => {
    try {
      const rewardsData = await fetchRewards(lang, country, token);
      setRewards([...rewardsData?.rewards, ...rewardsData?.claimedRewards]);
      setGlobalRewards([
        ...rewardsData?.rewards,
        ...rewardsData?.claimedRewards,
      ]);
      setRewardsClaimedInLastHr(rewardsData?.rewardsClaimedInLastHr);
      localStorage.setItem("bubbleLastClaimed", rewardsData?.bubbleLastClaimed);
    } catch (error) {
      await deleteAuthCookie(tele);

      console.log(error);
      showToast("default");
    }
  };

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
    try {
      const response = await fetchGameStats(token);
      setUserData(response.user);
      setGameData((prev) => {
        return {
          stats: response.stats,
          bag: response.bag,
          bank: response.bank,
          pouch: response.pouch,
          claimedItems: response.claimedItems,
          builder: response.builder,
        };
      });
      setTasks(response.quests);
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
          setSection(0);
          setIsLoading(false);
        }, 1000);
      }

      // else if (
      //   response?.user?.joiningBonus &&
      //   response?.user.isEligibleToClaim
      // ) {
      //   setSection(9);
      //   setTimeout(() => {
      //     setIsLoading(false);
      //   }, 1000);
      // }
    } catch (error) {
      await deleteAuthCookie(tele);
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
      const isTg = determineIsTelegram(tele.platform);
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
  }, [platform]);

  const sections = [
    <Citadel />, // 0
    <Explore />, // 1
    <Bag />, // 2
    <Blacksmith />, //  3
    <Merchant />, // 4
    <Vault />, // 5
    <Profile />, // 6
    <Leaderboard />, // 7
    <Gift />, // 8
    <Gacha />, // 9
    <JoinBonus />, // 10
    <Potions />, // 11
    <Book />, // 12,
    <Tavern />, // 13
  ];

  const bgs = {
    0: "/assets/bg/1280px-ror.citadel_wide.jpeg",
    1: assets.uxui.basebg,
    2: assets.uxui.basebg,
    3: "/assets/bg/1280px-ror.citadel.foundry_wide.jpeg",
    4: "/assets/bg/1280px-ror.citadel.bank_wide.jpeg",
    5: "/assets/bg/1280px-ror.citadel.bank_wide.jpeg",
    6: assets.uxui.basebg,
    7: assets.uxui.basebg,
    8: assets.uxui.basebg,
    9: assets.uxui.basebg,
    10: assets.uxui.basebg,
    10: assets.uxui.basebg,
    11: "/assets/bg/1280px-ror.citadel.apothecary_wide.jpeg",
    12: "/assets/bg/1280px-ror.citadel.library_wide.jpeg",
    13: "/assets/bg/1280px-ror.citadel.tavern_wide.jpeg",
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
          className={`w-screen transition-all duration-500 ${
            isTelegram ? "tg-container-height" : "browser-container-height"
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
