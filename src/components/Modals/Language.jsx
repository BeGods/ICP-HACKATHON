import React, { useState } from "react";
import IconButton from "../Buttons/IconButton";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import ToggleSwitch from "../Common/ToggleSwitch";

const languages = [
  { name: "Language", code: "" },
  { name: "English", code: "en" },
  { name: "हिन्दी", code: "hi" },
  { name: "Русский", code: "ru" },
  { name: "แบบไทย", code: "th" },
  { name: "Português", code: "pt" },
  { name: "Español", code: "es" },
  { name: "Filipino", code: "fil" },
];

const Language = ({ close }) => {
  const { t } = useTranslation();
  const [lang, setLang] = useState(false);
  const handleLanuageChange = (e) => {
    if (e.target.value == "") {
      i18next.changeLanguage("en");
    } else {
      i18next.changeLanguage(e.target.value);
    }
  };

  const handleApply = () => {
    close();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-85 backdrop-blur-[3px] flex flex-col justify-start items-center z-50">
      <div className="flex relative w-[76%] bg-[#1D1D1D] rounded-primary justify-center items-center flex-col mt-[52px] card-shadow-white p-6">
        <IconButton align={0} handleClick={close} activeMyth={4} />
        <select
          value={lang}
          onChange={handleLanuageChange}
          className="bg-black text-white p-2 mt-4 rounded w-full h-[40px] text-tertiary"
        >
          {languages.map((language) => (
            <option key={language.code} value={language.code}>
              {language.name === "Select" ? t("profile.select") : language.name}
            </option>
          ))}
        </select>
        <div className="flex text-tertiary text-white text-left justify-between w-full mt-6 pl-4">
          <div>Sound</div>
          <ToggleSwitch />
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

export default Language;
