import {Database} from '@nozbe/watermelondb';
import {NativeModules} from 'react-native';

declare global {
  interface Number {
    /**
     * @return Currency format based on current locale of the application.
     */
    formatIntoCurrency(): string;
  }

  let appDatabase: Database;
}
let currentLocale = NativeModules.I18nManager.localeIdentifier?.replace(
  '_',
  '-',
);
//currentLocale || 'en-us'
const IntlObject = new Intl.NumberFormat(currentLocale || 'en-us', {
  minimumFractionDigits: 2,
});

//eslint-disable-next-line no-extend-native
Number.prototype.formatIntoCurrency = function () {
  return IntlObject.format(this as number);
};
