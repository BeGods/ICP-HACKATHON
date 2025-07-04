import React, { useContext, useEffect, useState } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { ToggleSwitch } from "../Common/ToggleSwitch";
import {
  Check,
  ChevronRight,
  Globe,
  LayoutGrid,
  Map,
  SquareArrowOutUpRight,
  UserRoundPen,
  Vibrate,
  VibrateOff,
  Volume2,
  VolumeX,
  Wallet,
} from "lucide-react";
import { FofContext, MainContext } from "../../context/context";
import { countries } from "../../utils/country";
import {
  connectLineWallet,
  connectTonWallet,
  disconnectTonWallet,
  fetchProfilePhoto,
  fetchRewards,
  updateCountry,
} from "../../utils/api.fof";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { showToast } from "../Toast/Toast";
import {
  clearAllGuideCookie,
  deleteAuthCookie,
  deleteHapticCookie,
  handleClickHaptic,
  setCountryCookie,
  setHapticCookie,
  setLangCookie,
  setSoundStatus,
} from "../../helpers/cookie.helper";
import { trackEvent } from "../../utils/ga";
import liff from "@line/liff";
import { useLocation, useNavigate } from "react-router-dom";
import useWalletPayment from "../../hooks/LineWallet";
import WalletsModal from "./Wallets";
import { useTonWalletConnector } from "../../hooks/TonWallet";

const tele = window.Telegram?.WebApp;

const languages = [
  { name: "English", code: "en" },
  { name: "हिन्दी", code: "hi" },
  { name: "Русский", code: "ru" },

  { name: "ภาษาไทย", code: "th" },
  { name: "Português", code: "pt" },
  { name: "Español", code: "es" },

  { name: "Filipino", code: "fil" },
  { name: "Hausa", code: "ha" },
  { name: "မြန်မာ", code: "my" },

  { name: "Indonesia", code: "id" },
  { name: "বাংলা", code: "bn" },
  { name: "Yorùbá", code: "yo" },

  { name: "中文", code: "zh" },
  { name: "日本語", code: "ja" },
  { name: "한국어", code: "ko" },
];

const SettingModal = ({ close }) => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    authToken,
    enableSound,
    setEnableSound,
    country,
    setCountry,
    enableHaptic,
    setEnableHaptic,
    isTelegram,
    lineWallet,
  } = useContext(MainContext);
  const { connectWallet } = useWalletPayment();
  const {
    setRewards,
    setRewardsClaimedInLastHr,
    setUserData,
    setSection,
    setShowCard,
    setShowBack,
    section,
  } = useContext(FofContext);
  const userFriendlyAddress = useTonAddress();
  const [isChanged, setIsChanged] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { handleConnectTonWallet } = useTonWalletConnector();
  const walletLabel =
    isTelegram && userFriendlyAddress
      ? `${userFriendlyAddress.slice(0, 9)}...${userFriendlyAddress.slice(-6)}`
      : !isTelegram && lineWallet
      ? `${lineWallet?.slice(0, 9)}...${lineWallet.slice(-6)}`
      : "Connect";

  const handleSoundToggle = (e) => {
    e.stopPropagation();
    setEnableSound((prev) => {
      const newValue = !prev;
      if (newValue) {
        console.log("Yes set to true: ON");

        setSoundStatus(tele, true);
      } else {
        console.log("Yes set to false: OFF");

        setSoundStatus(tele, false);
      }
      return newValue;
    });
  };

  const handleHapticsToggle = (e) => {
    e.stopPropagation();
    setEnableHaptic((prev) => {
      const newValue = !prev;
      if (newValue) {
        deleteHapticCookie(tele);
        return true;
      } else {
        setHapticCookie(tele);
        return false;
      }
    });
  };

  const getPartnersData = async (lang, country) => {
    try {
      const rewardsData = await fetchRewards(lang, country, authToken);
      setRewards([...rewardsData?.rewards, ...rewardsData?.claimedRewards]);
      setRewardsClaimedInLastHr(rewardsData?.rewardsClaimedInLastHr);
      localStorage.setItem("bubbleLastClaimed", rewardsData?.bubbleLastClaimed);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLanguageChange = (e) => {
    e.stopPropagation();
    const langCode = e.target.value === "" ? "en" : e.target.value;
    setIsChanged(true);
    trackEvent("misc", `language_${langCode}`, `success_${langCode}`);
    i18next.changeLanguage(langCode);
    setLangCookie(tele, langCode);
  };

  const handleSettingChange = (e) => {
    e.stopPropagation();
    setIsChanged(true);
    const selectedCountry = e.target.value;

    setCountry(selectedCountry);
    handleUpdateCountry(selectedCountry);
    setCountryCookie(tele, selectedCountry);
    trackEvent(
      "misc",
      `country_${selectedCountry}`,
      `success_${selectedCountry}`
    );
  };

  const handleUpdateCountry = async (updatedCountry) => {
    try {
      await updateCountry(updatedCountry, authToken);

      setUserData((prev) => ({
        ...prev,
        country: updateCountry,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleConnectLineWallet = async (e) => {
    e.stopPropagation();

    if (isConnecting) return;
    setIsConnecting(true);
    try {
      if (isTelegram) {
        handleConnectTonWallet();
      } else {
        const walletData = await connectWallet();
        if (!walletData) {
          return;
        }
        const { signature, message } = walletData;
        await connectLineWallet(signature, message, authToken);
      }
    } catch (error) {
      console.error("Wallet Connection Error:", error);
      alert("An error occurred while connecting the wallet.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleEnableGuide = (e) => {
    e.stopPropagation();
    clearAllGuideCookie(tele);
    close();
    setSection(0);
  };

  const updateProfilePhoto = async () => {
    showToast("success_avatar");
    close();
    try {
      const response = await fetchProfilePhoto(authToken);
      if (response.avatarUrl) {
        setUserData((prev) => ({
          ...prev,
          avatarUrl: response.avatarUrl,
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (
  //       state.closeReason === "wallet-selected" &&
  //       state.status === "closed" &&
  //       (userData.tonAddress === null || !userData.tonAddress)
  //     ) {
  //       handleConnectTon();
  //     }
  //   });
  // }, [state]);

  const handleClose = (e) => {
    e.stopPropagation();
    handleClickHaptic(tele, enableHaptic);
    close();
    if (isChanged) {
      getPartnersData(i18n.language, country);
    }
  };

  useEffect(() => {
    setShowBack(section);

    return () => {
      setShowBack(null);
    };
  }, []);

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex flex-col justify-center items-center z-50"
    >
      <div
        className={`flex relative modal-width w-fit -mt-[2.5rem] bg-[#1D1D1D] rounded-primary justify-center items-center flex-col card-shadow-white p-4`}
      >
        <div
          onClick={handleClose}
          className={`absolute cursor-pointer flex w-full justify-end top-0 right-0 -mt-4 -mr-4 `}
        >
          <div className="absolute flex justify-center items-center  bg-black rounded-full w-[40px] h-[40px]">
            <div className="text-white font-roboto text-black-contour text-[1.25rem]">
              {"\u2715"}
            </div>
          </div>
        </div>
        <div className="flex w-full">
          <div className="flex justify-start pt-3 font-roboto items-center font-bold text-white w-[15%]">
            <Globe />
          </div>
          <div className="w-full">
            <select
              value={country}
              onChange={handleSettingChange}
              className="bg-black text-white p-2 mt-4 rounded w-full h-[40px] text-tertiary"
            >
              {countries.map((ctx) => (
                <option key={ctx.code} value={ctx.code}>
                  {ctx.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex w-full">
          <div className="flex justify-start pt-3 font-roboto items-center font-bold text-white w-[15%]">
            文A
          </div>
          <div className="w-full">
            <select
              value={i18n.language}
              onChange={handleLanguageChange}
              className="bg-black font-medium text-white p-2 mt-4 rounded w-full h-[40px] text-tertiary"
            >
              {languages.map((language) => (
                <option key={language.code} value={language.code}>
                  {language.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex text-tertiary text-white text-left w-full mt-6 pl-4">
          <div className="flex justify-start -ml-3">
            {enableSound ? <Volume2 /> : <VolumeX />}
          </div>
          <div className="flex justify-between w-full">
            <div className="pl-3">{t("profile.music")}</div>
            <ToggleSwitch
              handleToggle={handleSoundToggle}
              isActive={enableSound}
            />
          </div>
        </div>

        <div className="flex text-tertiary text-white text-left w-full mt-6 pl-4">
          <div className="flex justify-start -ml-3">
            {enableHaptic ? <Vibrate /> : <VibrateOff />}
          </div>
          <div className="flex justify-between w-full">
            <div className="pl-3">{t("misc.haptic")}</div>
            <ToggleSwitch
              handleToggle={handleHapticsToggle}
              isActive={enableHaptic}
            />
          </div>
        </div>

        <div
          onClick={handleEnableGuide}
          className="flex text-tertiary text-white text-left w-full mt-6 pl-4"
        >
          <div className="flex justify-start -ml-3">
            <Map />
          </div>
          <div className="flex justify-between w-full">
            <div className="pl-3">{t("profile.guide")}</div>
            <ChevronRight />
          </div>
        </div>

        <div
          onClick={updateProfilePhoto}
          className={`${
            !isTelegram ? "hidden" : "flex"
          } text-tertiary text-white text-left w-full mt-6 pl-4`}
        >
          <div className="flex justify-start -ml-3">
            <UserRoundPen />
          </div>
          <div className="flex justify-between w-full">
            <div className="pl-3">{t("profile.updatePhoto")}</div>
            <ChevronRight />
          </div>
        </div>

        <div
          onClick={(e) => {
            e.stopPropagation();
            tele.addToHomeScreen();
          }}
          className={`${
            !isTelegram ? "hidden" : "flex"
          } text-tertiary text-white text-left w-full mt-6 pl-4`}
        >
          <div className="flex justify-start -ml-3">
            <LayoutGrid />
          </div>
          <div className="flex justify-between w-full">
            <div className="pl-3">{t("profile.addToHome")}</div>
            <ChevronRight />
          </div>
        </div>

        {location.pathname !== "/" && (
          <div
            onClick={() => {
              if (!lineWallet) {
                handleConnectLineWallet();
              } else {
                setShowCard(<WalletsModal />);
              }
            }}
            className={`flex text-tertiary text-white text-left w-full mt-6 pl-4`}
          >
            <div className="flex justify-start -ml-3 pr-3">
              <Wallet />
            </div>
            <div className="flex justify-between w-full">
              {walletLabel}
              <ChevronRight />
            </div>
          </div>
        )}

        {!liff.isInClient() && !isTelegram && (
          <div
            onClick={async (e) => {
              e.stopPropagation();

              await deleteAuthCookie(tele);
              if (location.pathname === "/") {
                window.location.reload();
              } else {
                navigate("/");
              }
            }}
            className={`flex text-tertiary text-white text-left w-full mt-6 pl-4`}
          >
            <div className="flex justify-start -ml-3">
              <SquareArrowOutUpRight />
            </div>
            <div className="flex justify-between w-full">
              <div className="pl-3">Logout</div>
              <ChevronRight />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingModal;
