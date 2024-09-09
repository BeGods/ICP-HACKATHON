import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  PlugLogin,
  StoicLogin,
  NFIDLogin,
  IdentityLogin,
  HelloIDL,
} from "ic-auth";
import { useNavigate } from "react-router-dom";
import { setUserAndStore } from "../redux/authSlice.js";
import { CreateActor } from "ic-auth";
import { idlFactory } from "../../../declarations/BeGod_backend/BeGod_backend.did.js";
import LoginButton from "./components/LoginButton.jsx";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const canisterID = "avqkn-guaaa-aaaaa-qaaea-cai";
  const backend_canister_id = "ajuq4-ruaaa-aaaaa-qaaga-cai";
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
        console.log("user details", userObject);
        dispatch(setUserAndStore(userObject.principal));
        navigate("/admin");
      }
      console.log("idl factory", idlFactory);
      const actor = await CreateActor(
        userObject.agent,
        idlFactory,
        backend_canister_id
      );
      const collectionResponse = await actor.createExtCollection("sd");
      console.log("Collection response", collectionResponse);
      console.log("Created actor", actor);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const buttonDataArray = [
    {
      imgSrc: "/plug2-removebg-preview.png",
      color: "#3a86ff",
      name: "Plug",
      methodName: () => handleLogin("Plug"),
    },
    {
      imgSrc: "/stoic-removebg-preview.png",
      color: "#f9c74f",
      name: "Stoic",
      methodName: () => handleLogin("Stoic"),
    },
    {
      imgSrc: "/nfid-removebg-preview.png",
      color: "#ff006e",
      name: "NFID",
      methodName: () => handleLogin("NFID"),
    },
    {
      imgSrc: "favicon.ico",
      color: "#8338ec",
      name: "Identity",
      methodName: () => handleLogin("Identity"),
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white sm:flex-row bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="w-[80%] sm:w-[30%] h-[60vh] md:h-[90vh] bg-black/60 backdrop-blur-lg shadow-lg rounded-l-md p-8 hidden sm:flex sm:flex-col">
        <h1 className="text-[36px] text-white font-bold md:pt-[10vh]">
          Get Started
        </h1>
        <h2 className="text-[22px] text-gray-400 font-semibold mt-4">
          Connect your wallet
        </h2>
        <p className="text-[18px] text-gray-500 my-4 leading-relaxed ">
          Unlock the future—connect your wallet and step into the world of
          limitless possibilities.
        </p>

        <p className="text-[#FCD37B] text-xl py-5">
          Select your wallet from the options below to get started.
        </p>
      </div>
      <div className="sm:w-[55%] md:w-[50%] bg-gray-900/60 backdrop-blur-lg shadow-lg sm:h-[60vh] md:h-[90vh] rounded-r-md p-8">
        <h1 className="text-[36px] text-white font-bold mb-6 md:pt-[20vh]">
          Available Wallets
        </h1>
        <div className="h-[2px] w-[80%] bg-gray-600 mb-6"></div>
        <div
          id="wallet-options"
          className="flex flex-wrap gap-8 opacity-0 transform translate-y-8 transition-opacity duration-[1000ms] ease-in-out pt-4 flex-col md:flex-col sm:flex-row lg:flex-row"
        >
          {buttonDataArray.map((value, key) => (
            <LoginButton
              key={key}
              imgSrc={value.imgSrc}
              name={value.name}
              color={value.color}
              methodName={value.methodName}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
