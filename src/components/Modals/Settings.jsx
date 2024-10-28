import React, { useContext, useEffect, useState } from "react";
import IconBtn from "../Buttons/IconBtn";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import ToggleSwitch from "../Common/ToggleSwitch";
import { ChevronRight, Globe, Volume2, VolumeX, Wallet } from "lucide-react";
import { MyContext } from "../../context/context";
import { country } from "../../utils/country";
import {
  connectTonWallet,
  disconnectTonWallet,
  fetchRewards,
} from "../../utils/api";
import {
  useTonAddress,
  useTonConnectModal,
  useTonConnectUI,
} from "@tonconnect/ui-react";
import { showToast } from "../Toast/Toast";

const tele = window.Telegram?.WebApp;

const languages = [
  { name: "English", code: "en" },
  { name: "हिन्दी", code: "hi" },
  { name: "Русский", code: "ru" },
  { name: "ภาษาไทย", code: "th" },
  { name: "Português", code: "pt" },
  { name: "Español", code: "es" },
  { name: "Filipino", code: "fil" },
];

const SettingModal = ({ close }) => {
  const { i18n } = useTranslation();
  const {
    setRewards,
    setRewardsClaimedInLastHr,
    authToken,
    enableSound,
    setUserData,
    userData,
  } = useContext(MyContext);
  const [tonConnectUI] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();
  const { state, open } = useTonConnectModal();
  const [countryCode, setCountryCode] = useState("NA");
  const [isChanged, setIsChanged] = useState(false);

  const getPartnersData = async (lang, country) => {
    try {
      const rewardsData = await fetchRewards(lang, country, authToken);
      setRewards(rewardsData?.rewards);
      setRewardsClaimedInLastHr(rewardsData?.rewardsClaimedInLastHr);
      localStorage.setItem("bubbleLastClaimed", rewardsData?.bubbleLastClaimed);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    tele.CloudStorage.getItem("country_code", (err, item) => {
      if (item) {
        setCountryCode(item);
      }
    });
  }, []);

  const handleLanguageChange = (e) => {
    const langCode = e.target.value === "" ? "en" : e.target.value;
    setIsChanged(true);
    i18next.changeLanguage(langCode);
    tele.CloudStorage.setItem("lang", langCode);
  };

  const handleSettingChange = (e) => {
    setIsChanged(true);
    const selectedCountry = e.target.value;
    setCountryCode(selectedCountry);
    tele.CloudStorage.setItem("country_code", selectedCountry);
  };

  const handleConnectTon = async () => {
    try {
      await connectTonWallet({ tonAddress: userFriendlyAddress }, authToken);
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

  useEffect(() => {
    setTimeout(() => {
      if (
        state.closeReason === "wallet-selected" &&
        state.status === "closed" &&
        (userData.tonAddress === null || !userData.tonAddress)
      ) {
        handleConnectTon();
      }
    });
  }, [state]);

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

  // useEffect(() => {
  //   handleDisconnectTon();
  // }, []);

  const handleClose = () => {
    close();
    if (isChanged) {
      getPartnersData(i18n.language, countryCode);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex flex-col justify-center items-center z-50">
      <div className="flex relative w-[72%] bg-[#1D1D1D] rounded-primary justify-center items-center flex-col -mt-[28vh] card-shadow-white p-4">
        <IconBtn align={0} handleClick={handleClose} activeMyth={4} />
        <div className="flex w-full">
          <div className="flex justify-start pt-3 font-roboto items-center font-bold text-white w-[15%]">
            <Globe />
          </div>
          <div className="w-full">
            <select
              value={countryCode}
              onChange={handleSettingChange}
              className="bg-black text-white p-2 mt-4 rounded w-full h-[40px] text-tertiary"
            >
              {country.map((ctx) => (
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

        <div className="flex text-tertiary text-white text-left justify-between w-full mt-6 pl-4">
          <div className="flex justify-start -ml-3">
            <Wallet />
          </div>
          {userData.tonAddress ? (
            <div className="flex items-center w-full justify-end">
              {userData.tonAddress.length > 10
                ? `${userData.tonAddress.slice(0, 25)}...`
                : userData.tonAddress}
            </div>
          ) : (
            <div
              onClick={() => open()}
              className="flex items-center w-full justify-end"
            >
              <div>Connect</div>
              <ChevronRight size={"20px"} />
            </div>
          )}
        </div>

        <div className="flex text-tertiary text-white text-left justify-between w-full mt-6 pl-4">
          <div className="flex justify-start -ml-3">
            {enableSound ? <Volume2 /> : <VolumeX />}
          </div>
          <ToggleSwitch />
        </div>
      </div>
    </div>
  );
};

export default SettingModal;

// const handleEnableGuide = () => {
//   tele.HapticFeedback.notificationOccurred("success");

//   tele.CloudStorage.removeItem("g1");
//   tele.CloudStorage.removeItem("g2");
//   tele.CloudStorage.removeItem("g3");
//   tele.CloudStorage.removeItem("g4");
//   close();
//   setSection(0);
// };

{
  /* <div
          onClick={handleEnableGuide}
          className="flex text-tertiary text-white text-left justify-between w-full mt-6 pl-4"
        >
          <div> {t(`profile.guide`)}</div>
          <ChevronRight />
        </div> */
}

// const handleDisconnectTon = async () => {
//   try {
//     await disconnectTonWallet(authToken);
//     tonConnectUI.disconnect();
//     setUserData((prev) => ({
//       ...prev,
//       tonAddress: null,
//     }));
//     showToast("ton_connect_success");
//   } catch (error) {
//     console.log(error);

//     const errorMessage =
//       error.response.data.error ||
//       error.response.data.message ||
//       error.message ||
//       "An unexpected error occurred";

//     console.log(errorMessage);
//     showToast("ton_connect_error");
//   }
// };
