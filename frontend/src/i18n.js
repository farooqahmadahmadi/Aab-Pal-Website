import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const savedLang = localStorage.getItem("lang") || "en";

// JSON files import
import en from "./locales/en/translation.json";
import fa from "./locales/fa/translation.json";
import ps from "./locales/ps/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    fa: {
      translation: fa,
    },
    ps: {
      translation: ps,
    },
  },
  lng: savedLang,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
