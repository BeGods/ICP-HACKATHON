import React, { useContext, useEffect, useState } from "react";
import IconBtn from "../Buttons/IconBtn";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import ToggleSwitch from "../Common/ToggleSwitch";
import { Globe, Volume2 } from "lucide-react";
import { MyContext } from "../../context/context";
import { country } from "../../utils/country";

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
  const { t, i18n } = useTranslation();
  const { setSection } = useContext(MyContext);
  const [countryCode, setCountryCode] = useState("NA");

  useEffect(() => {
    tele.CloudStorage.getItem("country_code", (err, item) => {
      if (item) {
        setCountryCode(item);
      }
    });
  }, []);

  const handleLanuageChange = (e) => {
    const langCode = e.target.value === "" ? "en" : e.target.value;
    i18next.changeLanguage(langCode);
    tele.CloudStorage.setItem("lang", langCode);
  };

  const handleSettingChange = (e) => {
    const selectedCountry = e.target.value;
    setCountryCode(selectedCountry);
    tele.CloudStorage.setItem("country_code", selectedCountry);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex flex-col justify-center items-center z-50">
      <div className="flex relative w-[72%] bg-[#1D1D1D] rounded-primary justify-center items-center flex-col -mt-[28vh] card-shadow-white p-4">
        <IconBtn align={0} handleClick={close} activeMyth={4} />
        <div className="flex w-full">
          <div className="flex justify-start pt-3 font-roboto items-center font-bold text-white w-[15%]">
            文A
          </div>
          <div className="w-full">
            <select
              value={i18n.language}
              onChange={handleLanuageChange}
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

        <div className="flex text-tertiary text-white text-left justify-between w-full mt-6 pl-4">
          <div className="flex justify-start -ml-3">
            <Volume2 />
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
