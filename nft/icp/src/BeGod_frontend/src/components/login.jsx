import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { PlugLogin, StoicLogin, NFIDLogin, IdentityLogin } from 'ic-auth';
import { useNavigate } from "react-router-dom";
import { setUserAndStore } from '../redux/authSlice';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const canisterID = "avqkn-guaaa-aaaaa-qaaea-cai";
  const whitelist = [canisterID];

  useEffect(() => {
    // Adding fade-in effect for the wallets section
    document.getElementById("wallet-options").style.opacity = 1;
    document.getElementById("wallet-options").style.transform = "translateY(0)";
  }, []);

  const handleLogin = async (provider) => {
    let userObject = {
      principal: "Not Connected.",
      agent: undefined,
      provider: "N/A",
    };

    try {
      if (provider === "Plug") {
        userObject = await PlugLogin(whitelist);
      } else if (provider === "Stoic") {
        userObject = await StoicLogin();
      } else if (provider === "NFID") {
        userObject = await NFIDLogin();
      } else if (provider === "Identity") {
        userObject = await IdentityLogin();
      }
      if (userObject.agent._isAgent || userObject.agent.agent._isAgent) {
        console.log("user details", userObject.principal);
        dispatch(setUserAndStore(userObject.principal));
        navigate('/admin');
      }

    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="w-[80%] sm:w-[30%] h-[60vh] md:h-[90vh] bg-black/60 backdrop-blur-lg shadow-lg rounded-l-md p-8 hidden sm:flex sm:flex-col">
        <h1 className="text-[36px] text-white font-bold md:pt-[10vh]">Get Started</h1>
        <h2 className="text-[22px] text-gray-400 font-semibold mt-4">Connect your wallet</h2>
        <p className="text-[18px] text-gray-500 mt-4 leading-relaxed">
          Unlock the future—connect your wallet and step into the world of limitless possibilities.
          <br />
          <span className="text-[#FCD37B]">Select your wallet from the options below to get started.</span>
        </p>
        <div className="flex items-center mt-8">
          <div className="w-[15px] h-[15px] rounded-full bg-green-500"></div>
          <div className="h-[2px] w-[30px] bg-green-500"></div>
          <div className="w-[15px] h-[15px] rounded-full bg-gray-500"></div>
          <div className="h-[2px] w-[30px] bg-gray-500"></div>
          <div className="w-[15px] h-[15px] rounded-full bg-gray-500"></div>
        </div>
      </div>
      <div className="sm:w-[55%] md:w-[50%] bg-gray-900/60 backdrop-blur-lg shadow-lg sm:h-[60vh] md:h-[90vh] rounded-r-md p-8">
        <h1 className="text-[36px] text-white font-bold mb-6 md:pt-[20vh]">Available Wallets</h1>
        <div className="h-[2px] w-[80%] bg-gray-600 mb-6"></div>
        <div
          id="wallet-options"
          className="flex flex-wrap gap-8 opacity-0 transform translate-y-8 transition-opacity duration-[1000ms] ease-in-out"
        >
          <button
            onClick={() => handleLogin("Plug")}
            className="w-[40%] sm:w-[35%] h-[10vh] flex items-center justify-center bg-black/40 backdrop-blur-md rounded-lg transition-transform duration-300 hover:scale-110 hover:border-[#3a86ff] hover:text-[#3a86ff] border-[2px] border-transparent hover:shadow-neon"
          >
            <img src="/plug2-removebg-preview.png" alt="Plug Wallet" className="w-[30%] h-[60%]" />
            <h1 className="text-[18px] font-semibold ml-4">Plug</h1>
          </button>
          <button
            onClick={() => handleLogin("Stoic")}
            className="w-[40%] sm:w-[35%] h-[10vh] flex items-center justify-center bg-black/40 backdrop-blur-md rounded-lg transition-transform duration-300 hover:scale-110 hover:border-[#ffbe0b] hover:text-[#ffbe0b] border-[2px] border-transparent hover:shadow-neon"
          >
            <img src="/stoic-removebg-preview.png" alt="Stoic Wallet" className="w-[25%] h-[50%]" />
            <h1 className="text-[18px] font-semibold ml-4">Stoic</h1>
          </button>
          <button
            onClick={() => handleLogin("NFID")}
            className="w-[40%] sm:w-[35%] h-[10vh] flex items-center justify-center bg-black/40 backdrop-blur-md rounded-lg transition-transform duration-300 hover:scale-110 hover:border-[#ff006e] hover:text-[#ff006e] border-[2px] border-transparent hover:shadow-neon"
          >
            <img src="/nfid-removebg-preview.png" alt="NFID Wallet" className="w-[25%] h-[80%]" />
            <h1 className="text-[18px] font-semibold ml-4">NFID</h1>
          </button>
          <button
            onClick={() => handleLogin("Identity")}
            className="w-[40%] sm:w-[35%] h-[10vh] flex items-center justify-center bg-black/40 backdrop-blur-md rounded-lg transition-transform duration-300 hover:scale-110 hover:border-[#8338ec] hover:text-[#8338ec] border-[2px] border-transparent hover:shadow-neon"
          >
            <img src="/favicon.ico" alt="Identity Wallet" className="w-[30%] h-[70%]" />
            <h1 className="text-[18px] font-semibold ml-4">Identity</h1>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
