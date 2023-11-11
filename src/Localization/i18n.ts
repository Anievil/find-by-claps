import I18n from 'react-native-i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from './locales/en';
import arabic from './locales/arabic';
import esp from './locales/esp';
import french from './locales/french';
import german from './locales/german';
import hindi from './locales/hindi';
import indonesian from './locales/indonesian';
import korean from './locales/korean';
import portuguese from './locales/portuguese';
import ru from './locales/ru';

const languageDetector = async () => {
  const preferredLang = await AsyncStorage.getItem('@lang');
  if (preferredLang) {
    I18n.locale = preferredLang;
  }
};

I18n.fallbacks = true;
languageDetector();
I18n.translations = {
  en,
  ru,
  ar: arabic,
  es: esp,
  fr: french,
  de: german,
  hi: hindi,
  id: indonesian,
  ko: korean,
  pt: portuguese,
};

export default I18n;
