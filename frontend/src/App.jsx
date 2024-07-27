import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import Quests from "./pages/Quests";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import Leaderboard from "./pages/Leaderboard";

function App() {
  return (
    <>
      <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/mappasaurus/mappa-manifest/main/tonconnect-manifest.json">
        <Router>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/home" element={<Home />} />
            <Route path="/test" element={<Leaderboard />} />
          </Routes>
        </Router>
      </TonConnectUIProvider>
    </>
  );
}

export default App;
