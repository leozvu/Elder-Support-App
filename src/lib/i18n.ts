import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import translations
import translationEN from "../locales/en/translation.json";
import translationES from "../locales/es/translation.json";
import translationVI from "../locales/vi/translation.json";

const resources = {
  en: {
    translation: translationEN,
  },
  es: {
    translation: translationES,
  },
  vi: {
    translation: translationVI,
  },
};

i18n
  // detect user language
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next
  .use(initReactI18next)
  // init i18next
  .init({
    resources,
    fallbackLng: "en",
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    load: "languageOnly", // This ensures we load just 'vi' instead of 'vi-VN'
    supportedLngs: ["en", "es", "vi"],
    nonExplicitSupportedLngs: true, // This helps with language variants
  });

// Force reload translations when language changes
i18n.on("languageChanged", () => {
  document.documentElement.lang = i18n.language;
});

export default i18n;
