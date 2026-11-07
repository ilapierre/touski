import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({

        lng: 'fr',
        fallbackLng: 'en',
        debug: true,
        supportedLngs: ['fr', 'en', 'vn'],
        load: 'languageOnly',
        interpolation: {
            escapeValue: false
        }
    });

i18n.on('languageChanged', (lng) => {
 document.documentElement.lang = lng;
});
export default i18n