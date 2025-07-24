import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import ReactGA from "react-ga4";
import { useEffect, useState } from "react";
import IntroPage from "./app/common/Intro/Page";
import FoFMain from "./app/main/FoF";
import { MainContext } from "./context/context";
import assets from "./assets/assets.json";
import {
  fetchHapticStatus,
  getStorage,
  setStorage,
  validateSoundCookie,
} from "./helpers/cookie.helper";
import { WalletProvider } from "./context/wallet";
import RoRMain from "./app/main/RoR";
import LineCallback from "./app/common/Auth/LineCallback";

ReactGA.initialize(import.meta.env.VITE_GA_ID, { debug: true });

const tele = window.Telegram?.WebApp;

function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    const page = location.pathname;
    ReactGA.send({ hitType: "pageview", page });
  }, [location]);
}

function App() {
  const [isBrowser, setIsBrowser] = useState(false);
  const [recentToasts, setRecentToasts] = useState([]);
  const [section, setSection] = useState(1);
  const [minimize, setMinimize] = useState(0);
  const [activeMyth, setActiveMyth] = useState(0);
  const [game, setGame] = useState("fof");
  const [tokens, setTokens] = useState(null);
  const [payouts, setPayouts] = useState([]);
  const [showBack, setShowBack] = useState(null);
  const [lineWallet, setLineWallet] = useState(null);
  const [showCard, setShowCard] = useState(null);
  const [globalRewards, setGlobalRewards] = useState([]);
  const [triggerConf, setTriggerConf] = useState(false);
  const [activeReward, setActiveReward] = useState(null);
  const [enableHaptic, setEnableHaptic] = useState(true);
  const [isTelegram, setIsTelegram] = useState(false);
  const [isTgDesktop, setIsTgDesktop] = useState(false);
  const [isTgMobile, setIsTgMobile] = useState(false);
  const [enableSound, setEnableSound] = useState(true);
  const [userData, setUserData] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [country, setCountry] = useState("NA");
  const [lang, setLang] = useState(null);
  const [tasks, setTasks] = useState([]);
  const location = useLocation();
  usePageTracking();

  const initalStates = {
    assets,
    enableHaptic, //.
    setEnableHaptic,
    enableSound, //.
    setEnableSound,
    userData,
    setUserData,
    platform, //.
    setPlatform,
    authToken, //.
    setAuthToken,
    country, //.
    setCountry,
    lang, //.
    setLang,
    tasks,
    setTasks,
    isTelegram,
    setIsTelegram,
    game,
    setGame,
    setLineWallet,
    lineWallet,
    globalRewards,
    setGlobalRewards,
    triggerConf,
    setTriggerConf,
    activeReward,
    setActiveReward,
    setIsBrowser,
    isBrowser,
    isTgDesktop,
    setIsTgDesktop,
    isTgMobile,
    setIsTgMobile,
    tokens,
    setTokens,
    payouts,
    setPayouts,
    recentToasts,
    setRecentToasts,
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
  };

  const syncAllCookies = async () => {
    const isSoundActive = await validateSoundCookie(tele);
    const isHapticActive = await fetchHapticStatus(tele);
    const fetcedGame = await getStorage(tele, "game");

    setGame(fetcedGame);
    setEnableHaptic(isHapticActive);
    setEnableSound(JSON.parse(isSoundActive));
  };

  useEffect(() => {
    syncAllCookies();
  }, []);

  const handleCurrGame = async () => {
    try {
      if (location.pathname.startsWith("/fof")) {
        setGame("fof");
        await setStorage(tele, "game", "fof");
      } else if (location.pathname.startsWith("/ror")) {
        setGame("ror");
        await setStorage(tele, "game", "ror");
      }
    } catch (Error) {
      console.log(Error);
    }
  };

  useEffect(() => {
    (async () => handleCurrGame())();
  }, [location]);

  useEffect(() => {
    const setAppHeight = () => {
      const doc = document.documentElement;
      doc.style.setProperty("--app-height", `${window.innerHeight}px`);
    };

    setAppHeight();
    window.addEventListener("resize", setAppHeight);
    return () => window.removeEventListener("resize", setAppHeight);
  }, []);

  return (
    <MainContext.Provider value={initalStates}>
      <WalletProvider>
        <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/BOG-Game/frogdoggames-manifesto/main/ton-connect.manifest.json">
          <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/auth/line/callback" element={<LineCallback />} />
            <Route path="/fof" element={<FoFMain />} />
            <Route path="/ror" element={<RoRMain />} />
          </Routes>
        </TonConnectUIProvider>
      </WalletProvider>
    </MainContext.Provider>
  );
}

// Wrap App with Router
export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}
