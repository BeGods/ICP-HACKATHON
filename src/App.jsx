import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import ReactGA from "react-ga4";
import { useEffect } from "react";
import IntroPage from "./app/common/Intro/Page";
import FoFMain from "./app/main/FoF";
import {
  fetchHapticStatus,
  getStorage,
  setStorage,
  validateSoundCookie,
} from "./helpers/cookie.helper";
import { DappWalletProvider } from "./context/DappWallet";
import RoRMain from "./app/main/RoR";
import LineCallback from "./app/common/Auth/LineCallback";
import { useStore } from "./store/useStore";

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
  const location = useLocation();
  const setGame = useStore((s) => s.setGame);
  const setEnableHaptic = useStore((s) => s.setEnableHaptic);
  const setEnableSound = useStore((s) => s.setEnableSound);
  usePageTracking();

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
    <DappWalletProvider>
      <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/BOG-Game/frogdoggames-manifesto/main/ton-connect.manifest.json">
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/auth/line/callback" element={<LineCallback />} />
          <Route path="/fof" element={<FoFMain />} />
          <Route path="/ror" element={<RoRMain />} />
        </Routes>
      </TonConnectUIProvider>
    </DappWalletProvider>
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
