import React, { useContext, useState } from "react";
import IconBtn from "../Buttons/IconBtn";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import ToggleSwitch from "../Common/ToggleSwitch";
import { ChevronRight } from "lucide-react";
import { MyContext } from "../../context/context";
import { country } from "../../utils/country";

const tele = window.Telegram?.WebApp;

const languages = [
  { name: "Language", code: "" },
  { name: "English", code: "en" },
  { name: "हिन्दी", code: "hi" },
  { name: "Русский", code: "ru" },
  { name: "ภาษาไทย", code: "th" },
  { name: "Português", code: "pt" },
  { name: "Español", code: "es" },
  { name: "Filipino", code: "fil" },
];

const SettingModal = ({ close }) => {
  const { t } = useTranslation();
  const { setSection } = useContext(MyContext);
  const [lang, setLang] = useState(false);
  const handleLanuageChange = (e) => {
    if (e.target.value == "") {
      i18next.changeLanguage("en");
    } else {
      i18next.changeLanguage(e.target.value);
      tele.CloudStorage.setItem("lang", e.target.value);
    }
  };

  const handleApply = () => {
    close();
  };

  const handleEnableGuide = () => {
    tele.HapticFeedback.notificationOccurred("success");

    tele.CloudStorage.removeItem("g1");
    tele.CloudStorage.removeItem("g2");
    tele.CloudStorage.removeItem("g3");
    tele.CloudStorage.removeItem("g4");
    close();
    setSection(0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex flex-col justify-start items-center z-50">
      <div className="flex relative w-[76%] bg-[#1D1D1D] rounded-primary justify-center items-center flex-col mt-[52px] card-shadow-white p-6">
        <IconBtn align={0} handleClick={close} activeMyth={4} />
        <select
          value={lang}
          onChange={handleLanuageChange}
          className="bg-black text-white p-2 mt-4 rounded w-full h-[40px] text-tertiary"
        >
          {languages.map((language) => (
            <option key={language.code} value={language.code}>
              {language.name}
            </option>
          ))}
        </select>
        <select className="bg-black text-white p-2 mt-4 rounded w-full h-[40px] text-tertiary">
          {country.map((ctx) => (
            <option key={ctx.code} value={ctx.code}>
              {ctx.name}
            </option>
          ))}
        </select>
        <div className="flex text-tertiary text-white text-left justify-between w-full mt-6 pl-4">
          <div>🔈</div>
          <ToggleSwitch />
        </div>
        <div
          onClick={handleEnableGuide}
          className="flex text-tertiary text-white text-left justify-between w-full mt-6 pl-4"
        >
          <div> {t(`profile.guide`)}</div>
          <ChevronRight />
        </div>
        <div
          onClick={handleApply}
          className="w-full bg-white text-black text-center text-xl rounded-md py-2 mt-6"
        >
          {t(`profile.apply`)}
        </div>
      </div>
    </div>
  );
};

export default SettingModal;
