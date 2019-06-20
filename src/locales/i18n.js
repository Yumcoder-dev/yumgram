import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en-US/en_us';
import fa from './fa-IR/fa_ir';

const resources = { en, fa };
export const languages = [
  {
    key: 'en',
    label: 'English',
    icon: '🇬🇧'
  },
  {
    key: 'fa',
    label: 'فارسی',
    icon: '🇮🇷'
  }
];

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  fallbacks: true,

  keySeparator: true, // true if you use in messages.welcome format
  interpolation: {
    escapeValue: false // react already safes from xss
  }
});

export default i18n;
