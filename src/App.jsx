import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import Home from "./Home";
import IntroPage from "./pages/Intro/Page";
import Test from "./pages/Test";

function App() {
  return (
    <>
      <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/BOG-Game/frogdoggames-manifesto/main/ton-connect.manifest.json">
        <Router>
          <Routes>
            <Route path="/" element={<IntroPage />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </Router>
      </TonConnectUIProvider>
    </>
  );
}

export default App;
