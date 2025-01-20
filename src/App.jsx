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
import FoFLayout from "./app/main/FoF";

ReactGA.initialize(import.meta.env.VITE_GA_ID, { debug: true });

function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    const page = location.pathname;
    ReactGA.send({ hitType: "pageview", page });
  }, [location]);
}

function App() {
  usePageTracking();

  return (
    <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/BOG-Game/frogdoggames-manifesto/main/ton-connect.manifest.json">
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/home" element={<FoFLayout />} />
      </Routes>
    </TonConnectUIProvider>
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
