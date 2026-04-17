import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        dashboard: "Dashboard",
      },
    },
    ps: {
      translation: {
        dashboard: "ډشبورډ",
      },
    },
    fa: {
      translation: {
        dashboard: "داشبورد",
      },
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
