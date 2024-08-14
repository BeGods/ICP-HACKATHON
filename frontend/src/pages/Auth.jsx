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
  const [platform, setPlatform] = useState(null);
  const [disableDesktop, setDisableDestop] = useState(false);
  const [lang, setLang] = useState(null);

  // configure tma.auth
  const getUserData = async () => {
    if (tele) {
      try {
        await tele.ready();
        const { user } = tele.initDataUnsafe || {};
        if (!tele.isExpanded) tele.expand();
        setPlatform(tele.platform);
        tele.setHeaderColor("#000000");

        if (user) {
          const userData = {
            initData: tele?.initData,
          };
          const referCode = tele.initDataUnsafe?.start_param;

          // configureDefaultLanguage(tele.initDataUnsafe.user.language_code);
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

  // authenticate
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

  // detect default language
  // const configureDefaultLanguage = (lang) => {
  //   i18next.changeLanguage(lang);
  // };

  useEffect(() => {
    (async () => getUserData())();
    // delay to show captcha
    setTimeout(() => {
      setShowCaptcha(true);
    }, 3000);
  }, []);

  // detect device
  useEffect(() => {
    if (
      platform === "macos" ||
      platform === "windows" ||
      platform === "tdesktop" ||
      platform === "web" ||
      platform === "weba"
    ) {
      setShowCaptcha(false);
      setDisableDestop(true);
    } else {
      setDisableDestop(false);
    }
  }, [platform]);

  return (
    <div className="bg-white flex h-screen w-screen text-wrap">
      {disableDesktop ? (
        // TMA desktop view
        <div className="flex flex-col justify-center items-center h-screen w-screen bg-black">
          <img
            src="/assets/uxui/320px-begods.telegram.qrcode.png"
            alt="qr"
            className="rounded-3xl h-1/2 fof-glow"
          />
          <h1 className="text-white w-2/3 font-medium mt-4 text-center">
            We designed the BeGods app to be fully optimized for mobile use.
            Simply scan the QR code or use Telegram to start playing!
          </h1>
        </div>
      ) : (
        // TMA mobile view
        <div
          style={{
            background: "url(/assets/uxui/480px-fof.game_tiny.png)",
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
            <div className="flex flex-col h-screen">
              <div className="flex justify-center items-center w-full leading-tight">
                <div className="relative">
                  <img
                    src="/assets/uxui/forgesoffaith.svg"
                    alt="fof"
                    className="w-[200px] mt-4 fof-glow"
                  />
                </div>
              </div>
              <div className="flex flex-grow"></div>
              <div className="flex justify-center items-center">
                <img
                  src="/assets/logos/battle.gods.black.svg"
                  alt="logo"
                  className="w-[65px] h-[75px] mb-4"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Auth;
