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
import RoRMain from "./app/main/RoR";
import { MainContext } from "./context/context";
import assets from "./assets/assets.json";
import {
  fetchHapticStatus,
  validateSoundCookie,
} from "./helpers/cookie.helper";

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
  const [enableHaptic, setEnableHaptic] = useState(true);
  const [enableSound, setEnableSound] = useState(true);
  const [userData, setUserData] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [country, setCountry] = useState("NA");
  const [lang, setLang] = useState(null);
  const [tasks, setTasks] = useState([]);
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
  };

  const syncAllCookies = async () => {
    const isSoundActive = await validateSoundCookie(tele);
    const isHapticActive = await fetchHapticStatus(tele);

    setEnableHaptic(isHapticActive);
    setEnableSound(JSON.parse(isSoundActive));
  };

  useEffect(() => {
    syncAllCookies();
  }, []);

  return (
    <MainContext.Provider value={initalStates}>
      <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/BOG-Game/frogdoggames-manifesto/main/ton-connect.manifest.json">
        <Routes>
          <Route path="/" element={<IntroPage />} />
          <Route path="/fof" element={<FoFMain />} />
          <Route path="/ror" element={<RoRMain />} />
        </Routes>
      </TonConnectUIProvider>
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
