import AnalyticsManager from '@/src/app/services/AnalyticsManager';
import {database} from '@/src/database';
import Helper from '@/app/utils';

const DEFAULT = {symbol: '$', name: 'USD Dollar'};
export default class Currency {
  static _symbol = 'user_currency_symbol';
  static _name = 'user_currency_name';
  static async setCurrency(currencyName: string, currency: string) {
    if (currency.length <= 0) {
      Helper.makeToast("Can't save empty currency");
      return;
    }
    try {
      await database.adapter.setLocal(this._symbol, currency);
      await database.adapter.setLocal(this._name, currencyName);
    } catch (err: any) {
      Helper.makeToast('Error: ' + err.message);
    }
  }
  static async getCurrency(): Promise<typeof DEFAULT> {
    try {
      const symbol = await database.adapter.getLocal(this._symbol);
      const name = await database.adapter.getLocal(this._name);
      if (!symbol || !name) {
        AnalyticsManager.remoteLog('Currency Not found', {
          symbol: symbol || '',
          name: name || '',
        });
        return DEFAULT;
      }
      return {symbol, name};
    } catch (err: any) {
      AnalyticsManager.remoteLog('Currency Error', {err: err});
      // return default value if  not found.
      Helper.makeToast('Error: ' + err.message);
      return DEFAULT;
    }
  }
}
