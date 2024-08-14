import { initReactI18next } from "react-i18next";
import i18next from "i18next";
import English from "../translations/en/translation.json";
import Hindi from "../translations/hi/translation.json";

i18next.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: English,
    },
    hi: {
      translation: Hindi,
    },
  },
});
