import parse from 'parse-duration';
import de from 'parse-duration/locale/de.js';
import en from 'parse-duration/locale/en.js';
import es from 'parse-duration/locale/es.js';
import fr from 'parse-duration/locale/fr.js';
import ja from 'parse-duration/locale/ja.js';
import pt from 'parse-duration/locale/pt.js';
import ru from 'parse-duration/locale/ru.js';
import zh from 'parse-duration/locale/zh.js';

const units = {
  de: de,
  en: en,
  es: es,
  fr: fr,
  ja: ja,
  pt: pt,
  ru: ru,
  zh: zh,
};

export const parseDuration = (input: string, format: string, locale: string): number | undefined => {
  locale = locale.toLocaleLowerCase();
  locale = locale.startsWith('en') ? 'en' : locale;
  if (locale && locale in units) {
    parse.unit = units[locale];
  } else {
    console.warn(`button-card: parseDuration does not support locale '${locale}'`);
  }
  const result = parse(input, format);
  return result ?? undefined;
};
