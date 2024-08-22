import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import "./styles/filter.css";
import "./styles/glow.css";
import "./styles/speech.css";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import Test from "./pages/Test";
import Home from "./Home";
import Gacha from "./pages/Gacha";

function App() {
  return (
    <>
      <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/BOG-Game/frogdoggames-manifesto/main/ton-connect.manifest.json">
        <Router>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/bonus" element={<Gacha />} />
            <Route path="/home" element={<Home />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </Router>
      </TonConnectUIProvider>
    </>
  );
}

export default App;
