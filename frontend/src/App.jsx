import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import Test from "./pages/Test";
import Home from "./Home";

function App() {
  return (
    <>
      <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/BOG-Game/frogdoggames-manifesto/main/ton-connect.manifest.json">
        <Router>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/home" element={<Home />} />
            <Route path="/test" element={<Test />} />
          </Routes>
        </Router>
      </TonConnectUIProvider>
    </>
  );
}

export default App;
