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
  } = useContext(MainContext);
  const { setRewards, setRewardsClaimedInLastHr, setUserData, setSection } =
    useContext(FofContext);
  const [tonConnectUI] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();
  const [isChanged, setIsChanged] = useState(false);

  const handleSoundToggle = () => {
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

  const handleHapticsToggle = () => {
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
    const langCode = e.target.value === "" ? "en" : e.target.value;
    setIsChanged(true);
    trackEvent("misc", `language_${langCode}`, `success_${langCode}`);
    i18next.changeLanguage(langCode);
    setLangCookie(tele, langCode);
  };

  const handleSettingChange = (e) => {
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
      const response = await updateCountry(updatedCountry, authToken);
    } catch (error) {
      console.log(error);
    }
  };

  const handleConnectTon = async () => {
    try {
      await connectTonWallet({ tonAddress: userFriendlyAddress }, authToken);
      trackEvent("misc", "connect_wallet", "success");
      setUserData((prev) => ({
        ...prev,
        tonAddress: userFriendlyAddress,
      }));

      showToast("ton_connect_success");
    } catch (error) {
      const errorMessage =
        error.response.data.error ||
        error.response.data.message ||
        error.message ||
        "An unexpected error occurred";

      console.log(errorMessage);
      showToast("ton_connect_error");
    }
  };

  const handleDisconnectTon = async () => {
    try {
      await disconnectTonWallet(authToken);
      tonConnectUI.disconnect();
      setUserData((prev) => ({
        ...prev,
        tonAddress: null,
      }));
      showToast("ton_connect_success");
    } catch (error) {
      console.log(error);
      const errorMessage =
        error.response.data.error ||
        error.response.data.message ||
        error.message ||
        "An unexpected error occurred";
      console.log(errorMessage);
      showToast("ton_connect_error");
    }
  };

  const handleEnableGuide = () => {
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

  const handleClose = () => {
    handleClickHaptic(tele, enableHaptic);
    close();
    if (isChanged) {
      getPartnersData(i18n.language, country);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex flex-col justify-center items-center z-50">
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
          onClick={() => {
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

        {!liff.isInClient() && !isTelegram && (
          <div
            onClick={async () => {
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
