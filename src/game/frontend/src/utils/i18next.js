import { initReactI18next } from "react-i18next";
import i18next from "i18next";
import English from "../translations/en/translation.json";
import Hindi from "../translations/hi/translation.json";
import Spanish from "../translations/es/translation.json";
import Thai from "../translations/th/translation.json";
import Portugese from "../translations/pt/translation.json";
import Russian from "../translations/ru/translation.json";
import Fillipino from "../translations/fil/translation.json";
import Myanmar from "../translations/my/translation.json";
import Indonesian from "../translations/id/translation.json";
import Bengalli from "../translations/bn/translation.json";
import Hausa from "../translations/ha/translation.json";
import Japanese from "../translations/ja/translation.json";
import Korean from "../translations/ko/translation.json";
import Chineese from "../translations/cn/translation.json";
import Yoruba from "../translations/yo/translation.json";


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
    es: {
      translation: Spanish,
    },

    pt: {
      translation: Portugese,
    },
    ru: {
      translation: Russian,
    },
    th: {
      translation: Thai,
    },

    fil: {
      translation: Fillipino,
    },
    my: {
      translation: Myanmar,
    },
    id: {
      translation: Indonesian,
    },

    ha: {
      translation: Hausa,
    },
    bn: {
      translation: Bengalli,
    },
    zh: {
      translation: Chineese,
    },

    ja: {
      translation: Japanese,
    },
    yo: {
      translation: Yoruba,
    },
    ko: {
      translation: Korean,
    },


  },
});
