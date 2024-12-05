import React, { useEffect, useState } from "react";
import { authenticate } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import assets from "../../assets/assets.json";
import ReactHowler from "react-howler";
import {
  setAuthCookie,
  setLangCookie,
  validateSoundCookie,
} from "../../helpers/cookie.helper";
import { trackComponentView } from "../../utils/ga";

const tele = window.Telegram?.WebApp;

const IntroPage = (props) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [referralCode, setReferralCode] = useState(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [fadeout, setFadeout] = useState(false);
  const [platform, setPlatform] = useState(null);
  const [enableSound, setEnableSound] = useState(true);
  const [disableDesktop, setDisableDestop] = useState(false);

  // configure tma.auth
  const getUserData = async () => {
    if (tele) {
      try {
        await tele.ready();

        const { user } = tele.initDataUnsafe || {};
        if (!tele.isExpanded) tele.expand();
        setPlatform(tele.platform);
        tele.addToHomeScreen();
        tele.lockOrientation();
        tele.enableClosingConfirmation();
        tele.disableVerticalSwipes();
        tele.setHeaderColor("#000000");
        tele.setBackgroundColor("#000000");
        tele.setBottomBarColor("#000000");
        // tele.LocationManager.init(function () {
        //   window.Telegram.WebApp.LocationManager.getLocation(function (
        //     locationData
        //   ) {
        //     toast.success(locationData);
        //   });
        // });

        if (user) {
          const userData = {
            initData: tele?.initData,
          };
          const param = tele.initDataUnsafe?.start_param;

          setUserData(userData);

          if (param.includes("FDG")) {
            setReferralCode(param);
          } else {
            setLangCookie(tele, param);
          }
        } else {
          console.log("No user found in Telegram data");
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
      await setAuthCookie(tele, response.data.token);
      setTimeout(() => {
        setFadeout(true);
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }, 3000);
    } catch (error) {
      console.error("Authentication Error: ", error);
    }
  };

  const checkSoundActive = async () => {
    const isSoundActive = await validateSoundCookie(tele);
    setEnableSound(JSON.parse(isSoundActive));
  };

  useEffect(() => {
    trackComponentView("landing_page");
    getUserData();
    checkSoundActive();

    const handleUserInteraction = () => {
      playAudio();
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);
    document.addEventListener("touchstart", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    console.log(platform);

    if (
      platform === "macos" ||
      platform === "windows" ||
      platform === "tdesktop" ||
      platform === "web" ||
      platform === "weba" ||
      platform === "unknown"
    ) {
      setDisableDestop(true);
    } else {
      setDisableDestop(false);
      (async () => await auth())();
    }
    if (platform === "ios") {
      document.body.style.position = "fixed";
      document.body.style.top = 0;
      document.body.style.bottom = 0;
      document.body.style.left = 0;
      document.body.style.right = 0;
      document.body.style.overflow = "hidden";
    }
  }, [platform]);

  function setFullHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  window.addEventListener("resize", setFullHeight);
  setFullHeight();

  return (
    <div className="bg-white text-black flex h-screen w-screen text-wrap">
      {disableDesktop ? (
        // TMA desktop view
        <div className="flex flex-col justify-center items-center h-screen w-screen bg-black">
          <img
            src={assets.logos.fofQr}
            alt="qr"
            className="rounded-3xl h-1/2 fof-text-shadow"
          />
          <h1 className="text-white text-secondary w-2/3 font-medium mt-4 text-center">
            We designed the BeGods app to be fully optimized for mobile use.
            Simply scan the QR code or use Telegram to start playing!
          </h1>
          {/* //TODO: this can be improved */}
          <div className="mx-auto flex w-[80%] justify-between mt-8">
            <div
              onClick={() => {
                window.open("www.battleofgods.io", "_blank");
              }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Globe_icon-white.svg"
                alt="web"
                className="h-[14vw] w-[14vw]"
              />
            </div>
            <div
              onClick={() => {
                window.open("https://t.me/begods_games", "_blank");
              }}
            >
              <img
                src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/telegram-white-icon.png"
                alt="telegram"
                className="h-[14w] w-[14vw]"
              />
            </div>
            <div
              onClick={() => {
                window.open("https://x.com/BattleofGods_io", "_blank");
              }}
            >
              <img
                src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/x-social-media-white-icon.png"
                alt="x"
                className="h-[13vw] w-[13vw]"
              />
            </div>
            <div
              onClick={() => {
                window.open("https://discord.com/invite/Ac7h7huthN", "_blank");
              }}
            >
              <img
                src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6ca814282eca7172c6_icon_clyde_white_RGB.svg"
                alt="discord"
                className="h-[14vw] w-[14vw]"
              />
            </div>
          </div>
        </div>
      ) : (
        // TMA mobile view
        <div
          style={{
            background: `url(${assets.uxui.fofsplash})`,
            backgroundPosition: "50% 0%",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            height: "100vh",
            width: "100vw",
            position: "fixed",
            top: 0,
            left: 0,
          }}
        >
          <div className="flex flex-col h-screen ">
            <div className="flex justify-center items-center w-full leading-tight">
              <div className="relative z-[100]">
                <img
                  src={assets.logos.fof}
                  alt="fof"
                  className="w-[200px] mt-6 fof-text-shadow pointer-events-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-center h-screen absolute fade-in scale-110">
              <img
                src={assets.uxui.tower}
                alt="tower"
                className="fof-text-shadow -mt-6"
              />
            </div>
            <div className="flex flex-grow"></div>
            <div
              className={`flex ${
                fadeout && "fade-out"
              } justify-center items-center z-[100]`}
            >
              <img
                src={assets.logos.begodsBlack}
                alt="logo"
                className="w-[65px] h-[75px] mb-6 begod-text-shadow pointer-events-none"
              />
            </div>
          </div>
        </div>
      )}

      <div className="absolute">
        <ReactHowler
          src={assets.audio.fofIntro}
          playing={!disableDesktop && enableSound}
          preload={true}
          loop
        />
      </div>
    </div>
  );
};

export default IntroPage;
