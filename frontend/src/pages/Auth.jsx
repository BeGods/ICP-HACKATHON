import React, { useEffect, useState } from "react";
import { authenticate } from "../utils/api";
import { useNavigate } from "react-router-dom";
import Captcha from "../components/Captcha";

const tele = window.Telegram?.WebApp;

const Auth = (props) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [referralCode, setReferralCode] = useState(null);
  const [showCaptcha, setShowCaptcha] = useState(false);

  const getUserData = async () => {
    if (tele) {
      try {
        await tele.ready();
        const { user } = tele.initDataUnsafe || {};
        if (!tele.isExpanded) tele.expand();
        tele.setHeaderColor("#000000");

        if (user) {
          const userData = {
            initData: tele?.initData,
          };
          const referCode = tele.initDataUnsafe?.start_param;

          setUserData(userData);
          setReferralCode(referCode);
        } else {
          console.warn("No user found in Telegram data");
        }
      } catch (error) {
        console.error("Error fetching user data from Telegram:", error);
      }
    } else {
      console.warn("Telegram WebApp is not available");
    }
  };

  const auth = async () => {
    try {
      const response = await authenticate(userData, referralCode);
      // tele.CloudStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("accessToken", response.data.token);
      navigate("/home");
    } catch (error) {
      console.error("Authentication Error: ", error);
      setRes(error.message);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setShowCaptcha(true);
    }, 3000);
  }, []);

  return (
    <div
      style={{
        background: "url(/images/main.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      {showCaptcha ? (
        <Captcha auth={auth} />
      ) : (
        <div className="flex flex-col h-[100vh]">
          <div className="flex justify-center items-center w-full leading-tight">
            <div className="mt-2">
              <h1
                className="flex items-center gap-4 text-[50px] font-fof text-fof"
                style={{ textShadow: "-2px 4px 2px rgba(0, 0, 0, 1)" }}
              >
                FORGES
              </h1>
              <h1
                className="flex items-center gap-4 text-[24px] font-fof text-fof ml-[80px] -mt-3"
                style={{ textShadow: "-2px 4px 2px rgba(0, 0, 0, 1)" }}
              >
                OF
              </h1>
              <h1
                className="flex items-center gap-4 text-[50px] font-fof text-fof ml-[110px] -mt-3"
                style={{ textShadow: "-2px 4px 2px rgba(0, 0, 0, 1)" }}
              >
                FAITH
              </h1>
            </div>
          </div>
          <div className="flex flex-grow"></div>
          <div className="flex justify-center items-center">
            <img
              src="/assets/logos/battle.gods.black.svg"
              alt="logo"
              className="w-[65px] h-[75px] mb-8"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Auth;
