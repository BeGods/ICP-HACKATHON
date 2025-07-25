import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/useAuthClient.jsx";
import LoginButton from "./components/LoginButton.jsx";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { adminlogin, isAuthenticated, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Trigger the animation effect for wallet options
  useEffect(() => {
    document.getElementById("wallet-options").style.opacity = 1;
    document.getElementById("wallet-options").style.transform = "translateY(0)";
  }, []);

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => setIsLoading(false), 1000);
    }
    if (!isLoading) {
      if (isAuthenticated) {
        navigate("/admin/dashboard");
      } else {
        navigate("/admin/login");
      }
    }
  }, [isAuthenticated, navigate]);

  const buttonDataArray = [
    {
      imgSrc: "/plug2-removebg-preview.png",
      color: "#3a86ff",
      name: "Plug",
      methodName: () => adminlogin("plug"),
    },
    {
      imgSrc: "/stoic-removebg-preview.png",
      color: "#f9c74f",
      name: "Stoic",
      methodName: () => adminlogin("stoic"),
    },
    {
      imgSrc: "/nfid-removebg-preview.png",
      color: "#ff006e",
      name: "NFID",
      methodName: () => adminlogin("nfid"),
    },
    {
      imgSrc: "favicon.ico",
      color: "#8338ec",
      name: "Identity",
      methodName: () => adminlogin("ii"),
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white sm:flex-row bg-gradient-to-br from-black via-gray-900 to-black admin-control-font">
      {/* Left Section - Get Started */}
      <div className="w-[90%] sm:w-[30%] min-h-auto sm:min-h-[70vh] md:min-h-[80vh] bg-black/60 backdrop-blur-lg shadow-lg rounded-md p-8 mb-8 sm:mb-0 sm:rounded-l-md sm:rounded-r-none flex flex-col">
        <h1 className="text-[28px] sm:text-[36px] text-white font-bold md:pt-[5vh]">
          Get Started
        </h1>
        <h2 className="text-[18px] sm:text-[22px] text-gray-400 font-semibold mt-4">
          Connect your wallet
        </h2>
        <p className="text-[16px] sm:text-[18px] text-gray-500 my-4 leading-relaxed">
          Unlock the future—connect your wallet and step into the world of
          limitless possibilities.
        </p>

        <p className="text-[#FCD37B] text-lg sm:text-xl py-5">
          Select your wallet from the options below to get started.
        </p>
      </div>

      {/* Right Section - Wallet Options */}
      <div className="w-[90%] sm:w-[60%] md:w-[50%] min-h-auto sm:min-h-[70vh] md:min-h-[80vh] bg-gray-900/60 backdrop-blur-lg shadow-lg rounded-md p-8 sm:rounded-r-md sm:rounded-l-none">
        <h1 className="text-[28px] sm:text-[36px] text-white font-bold mb-6">
          Available Wallets
        </h1>
        <div className="h-[2px] w-[80%] bg-gray-600 mb-6"></div>

        <div
          id="wallet-options"
          className="flex flex-col sm:flex-row flex-wrap gap-6 sm:gap-8 opacity-0 transform translate-y-8 transition-opacity duration-[1000ms] ease-in-out pt-4"
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
