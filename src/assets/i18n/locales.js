import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import enTranslation from './en.json';
import esTranslation from './es.json';
const resources = {
	en: {
		translation: enTranslation,
	},
	es: {
		translation: esTranslation,
	},
};
const lang = localStorage.lang;
i18n.use(initReactI18next).init({
	resources,

	lng: lang ?? 'es',
	keySeparator: false,
	interpolation: {
		escapeValue: false,
	},
});
export default i18n;
