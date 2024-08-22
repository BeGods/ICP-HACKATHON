import React, { useEffect, useState } from "react";
import { authenticate } from "../utils/api";
import { useNavigate } from "react-router-dom";
import Captcha from "../components/Captcha";
import ReactHowler from "react-howler";

const tele = window.Telegram?.WebApp;

const Auth = (props) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [referralCode, setReferralCode] = useState(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [platform, setPlatform] = useState(null);
  const [disableDesktop, setDisableDestop] = useState(false);

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
      localStorage.setItem("accessToken", response.data.token);
      // navigate("/bonus");
      // const status = await fetchBonusStatus(response.data.token);
      // if (status.isEligibleToClaim) {
      //   navigate("/bonus");
      // } else {
      //   navigate("/home");
      // }
      navigate("/home");
    } catch (error) {
      console.error("Authentication Error: ", error);
    }
  };

  useEffect(() => {
    getUserData();
    // delay to show captcha
    setTimeout(() => {
      setShowCaptcha(true);
    }, 3000);

    // Add event listener for user interaction
    const handleUserInteraction = () => {
      playAudio();
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };

    // Attach the listener for user interaction
    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);

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
            className="rounded-3xl h-1/2 fof-text-shadow"
          />
          <h1 className="text-white text-secondary w-2/3 font-medium mt-4 text-center">
            We designed the BeGods app to be fully optimized for mobile use.
            Simply scan the QR code or use Telegram to start playing!
          </h1>
          <div className="mx-auto flex w-2/3 justify-between mt-8">
            <div
              onClick={() => {
                window.open("https://frogdog.games/", "_blank");
              }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Globe_icon-white.svg"
                alt="web"
                className="h-[10vw] w-[10vw]"
              />
            </div>
            <div
              onClick={() => {
                window.open("", "_blank");
              }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Telegram_2019_Logo.svg/242px-Telegram_2019_Logo.svg.png"
                alt="web"
                className="h-[11w] w-[11vw]"
              />
            </div>
            <div
              onClick={() => {
                window.open("", "_blank");
              }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/X_logo_2023.svg/200px-X_logo_2023.svg.png"
                style={{ filter: "invert(100%)" }}
                alt="telegram"
                className="h-[8vw] w-[8vw] mt-2"
              />
            </div>
            <div
              onClick={() => {
                window.open("https://discord.gg/GxpMEG6h", "_blank");
              }}
            >
              <img
                src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6ca814282eca7172c6_icon_clyde_white_RGB.svg"
                alt="telegram"
                className="h-[12vw] w-[12vw]"
              />
            </div>
          </div>
        </div>
      ) : (
        // TMA mobile view
        <div
          style={{
            background: "url(/assets/uxui/480px-fof.game.png)",
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
                    src="/assets/logos/forgesoffaith.svg"
                    alt="fof"
                    className="w-[200px] mt-4 fof-text-shadow"
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
      <ReactHowler
        src="/assets/audio/fof.music.intro.mp3"
        playing={true}
        preload={true}
        loop
      />
    </div>
  );
};

export default Auth;
