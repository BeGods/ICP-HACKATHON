import React, { useContext, useEffect, useState } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { ToggleSwitch } from "../Common/ToggleSwitch";
import {
  ChevronRight,
  Globe,
  LayoutGrid,
  Map,
  SquareArrowOutUpRight,
  Vibrate,
  VibrateOff,
  Volume2,
  VolumeX,
  Wallet,
} from "lucide-react";
import { FofContext, MainContext } from "../../context/context";
import { countries } from "../../utils/country";
import {
  fetchProfilePhoto,
  fetchRewards,
  updateProfile,
} from "../../utils/api.fof";
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
  const [isChanged, setIsChanged] = useState(false);

  const handleSoundToggle = (e) => {
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
      await updateProfile(updatedCountry, null, authToken);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEnableGuide = (e) => {
    clearAllGuideCookie(tele);
    close();
    setSection(0);
  };

  const handleClose = () => {
    handleClickHaptic(tele, enableHaptic);
    close();
    if (isChanged) {
      getPartnersData(i18n.language, country);
    }
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex flex-col justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
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
          onClick={(e) => {
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
            onClick={async (e) => {
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

{
  /* <div
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
        </div> */
}
