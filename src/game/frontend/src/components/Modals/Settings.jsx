import { useState } from "react";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
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
import { countries } from "../../utils/country";
import {
  connectLineWallet,
  connectTonWallet,
  updateProfile,
} from "../../utils/api.fof";
import {
  clearAllGuideCookie,
  deleteAuthCookie,
  deleteHapticCookie,
  setCountryCookie,
  setHapticCookie,
  setLangCookie,
  setSoundStatus,
} from "../../helpers/cookie.helper";
import { trackEvent } from "../../utils/ga";
import liff from "@line/liff";
import { useLocation, useNavigate } from "react-router-dom";
import ModalLayout, {
  ModalItemLyt,
  ModalSelectLyt,
  ModalSwitchLyt,
} from "../Layouts/ModalLayout";
import { useTonAddress } from "@tonconnect/ui-react";
import { useTonWallet } from "../../hooks/useTonWallet";
import { useStore } from "../../store/useStore";

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

const SettingModal = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const authToken = useStore((s) => s.authToken);
  const enableSound = useStore((s) => s.enableSound);
  const setEnableSound = useStore((s) => s.setEnableSound);
  const country = useStore((s) => s.country);
  const setCountry = useStore((s) => s.setCountry);
  const enableHaptic = useStore((s) => s.enableHaptic);
  const setEnableHaptic = useStore((s) => s.setEnableHaptic);
  const isTelegram = useStore((s) => s.isTelegram);
  const lineWallet = useStore((s) => s.lineWallet);

  const [isConnecting, setIsConnecting] = useState(false);
  const { handleConnectTonWallet } = useTonWallet();
  const userFriendlyAddress = useTonAddress();

  const handleConnectLineWallet = async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    try {
      const { signature, message } = await connectTonWallet();

      await connectLineWallet(signature, message, authToken);
    } catch (error) {
      console.error("Wallet Connection Error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

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

  // const getPartnersData = async (lang, country) => {
  //   try {
  //     const rewardsData = await fetchRewards(lang, country, authToken);
  //     setRewards([...rewardsData?.rewards, ...rewardsData?.claimedRewards]);
  //     setRewardsClaimedInLastHr(rewardsData?.rewardsClaimedInLastHr);
  //     localStorage.setItem("bubbleLastClaimed", rewardsData?.bubbleLastClaimed);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleLanguageChange = (e) => {
    const langCode = e.target.value === "" ? "en" : e.target.value;
    // setIsChanged(true);
    trackEvent("misc", `language_${langCode}`, `success_${langCode}`);
    i18next.changeLanguage(langCode);
    setLangCookie(tele, langCode);
  };

  const handleSettingChange = (e) => {
    // setIsChanged(true);
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
    window.location.reload();
  };

  return (
    <ModalLayout>
      <ModalSelectLyt
        icon={<Globe />}
        value={country}
        handleOnChange={handleSettingChange}
        options={countries}
      />
      <ModalSelectLyt
        icon={"文A"}
        value={i18n.language}
        handleOnChange={handleLanguageChange}
        options={languages}
      />
      <ModalSwitchLyt
        icon={enableSound ? <Volume2 /> : <VolumeX />}
        label={t("profile.music")}
        handleToggle={handleSoundToggle}
        isActive={enableSound}
      />
      <ModalSwitchLyt
        icon={enableHaptic ? <Vibrate /> : <VibrateOff />}
        label={t("misc.haptic")}
        handleToggle={handleHapticsToggle}
        isActive={enableHaptic}
      />
      <ModalItemLyt
        icon={<Map />}
        label={t("profile.guide")}
        handleClick={handleEnableGuide}
        placeholder={<ChevronRight />}
      />

      {isTelegram && (
        <ModalItemLyt
          icon={<LayoutGrid />}
          label={t("profile.addToHome")}
          handleClick={(e) => {
            tele.addToHomeScreen();
          }}
          placeholder={<ChevronRight />}
        />
      )}
      <ModalItemLyt
        icon={<Wallet />}
        label={
          isTelegram && userFriendlyAddress
            ? `${userFriendlyAddress.slice(0, 9)}...${userFriendlyAddress.slice(
                -6
              )}`
            : !isTelegram && lineWallet
            ? `${lineWallet.slice(0, 9)}...${lineWallet.slice(-6)}`
            : t("profile.wallet")
        }
        handleClick={() => {
          if (!isTelegram) {
            if (!lineWallet) {
              (async () => await handleConnectLineWallet())();
            }
          } else {
            if (!userFriendlyAddress) {
              handleConnectTonWallet();
            }
          }
        }}
        placeholder={<ChevronRight />}
      />

      {!liff.isInClient() && !isTelegram && (
        <ModalItemLyt
          icon={<SquareArrowOutUpRight />}
          label={"Logout"}
          handleClick={async (e) => {
            await deleteAuthCookie(tele);
            if (location.pathname === "/") {
              window.location.reload();
            } else {
              navigate("/");
            }
          }}
          placeholder={<ChevronRight />}
        />
      )}
    </ModalLayout>
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
