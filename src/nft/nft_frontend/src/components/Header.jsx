import { useState } from "react";
import LoginModal from "./LoginModal";
import { useSelector } from "react-redux";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = (props) => {
  const [language, setLanguage] = useState("en");
  const [showLogin, setShowLogin] = useState(false);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const navigate = useNavigate();

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-[60] font-mono">
        <div className="bg-[#161616] border-b border-white/10 shadow-2xl">
          <div className="max-w-7xl mx-auto w-full px-4 py-3 flex items-center justify-between">
            <div
              onClick={() => {
                navigate("/");
              }}
              className="flex items-center cursor-pointer"
            >
              <img
                src="https://media.publit.io/file/BeGods/logos/frogdog.games.black.svg"
                alt="Logo"
                className="h-12 w-auto"
              />
            </div>

            <div className="flex items-center gap-8">
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent  text-white rounded-full px-3 py-2 text-md focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="en">English</option>
              </select>
              {isAuthenticated ? (
                <div
                  onClick={() => {
                    navigate("/profile");
                  }}
                  className={`bg-gray-600 cursor-pointer w-10 h-10 rounded-full relative flex-shrink-0`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-lg">
                      <User color="white" />
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowLogin(true);
                  }}
                  className="bg-white backdrop-blur-sm text-black border border-white/20 px-4 py-2 rounded-full font-semibold hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Connect
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
};

export default Header;
