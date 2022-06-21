import enTranslations from "./en";
import arTranslations from "./ar";

export type TranslationKeys =  keyof typeof enTranslations;
export default {
    en: {
        translation: enTranslations
    },
    ar: {
        translation: arTranslations
    }
};
