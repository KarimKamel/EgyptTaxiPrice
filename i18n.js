import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import LanguageDetector from "i18next-browser-languagedetector";
// import XHR from "i18next-xhr-backend";
import translationEng from "./locales/en/translation.json";
import translationAr from "./locales/ar/translation.json";
import headerEng from "./locales/en/header.json";
import headerAr from "./locales/ar/header.json";
import formEng from "./locales/en/form.json";
import formAr from "./locales/ar/form.json";
import containerEng from "./locales/en/container.json";
import containerAr from "./locales/ar/container.json";

i18n

  //   .use(XHR)
  .use(initReactI18next)

  //   .use(LanguageDetector)

  .init({
    debug: true,
    lng: "en",
    fallbackLng: "en",
    keySeparator: false,

    interpolation: {
      escapeValue: false,
    },

    resources: {
      en: {
        translation: translationEng,
        header: headerEng,
        form: formEng,
        container: containerEng,
      },

      ar: {
        translation: translationAr,
        header: headerAr,
        form: formAr,
        container: containerAr,
      },
    },

    // ns: ["translation", "header"],
    // defaultNS: "translation",
  });

export default i18n;
