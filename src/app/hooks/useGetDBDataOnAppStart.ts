import React from 'react';
import {I18nManager} from 'react-native';
import {useSetRecoilState} from 'recoil';
import {CommonOperations, CurrencyOperations} from '../../database';
import {
  UtilState,
  currencyState,
  categoriesState,
  transactionsByMonthState,
  budgetState,
} from '../state';
import {PaymentManager} from '../helper';
import {useToastContext} from '../components';
import {captureException} from '@sentry/react-native';

let _maxRetryAttempt = 3;
export default () => {
  const [loading, setLoading] = React.useState(true);
  const toast = useToastContext();
  const setCurrencyInRecoil = useSetRecoilState(currencyState);
  const setCategoriesInRecoil = useSetRecoilState(categoriesState);
  const setTransactionInRecoil = useSetRecoilState(transactionsByMonthState);
  const setPremiumStatusOfUser = useSetRecoilState(UtilState.premiumUtilAtom);
  const setBudgetsInRecoil = useSetRecoilState(budgetState);
  const getDataFromDatabase = async () => {
    try {
      const result = await CommonOperations.getAppData();
      if (result) {
        setCategoriesInRecoil(result.categories);
        setTransactionInRecoil(result.transactions);
        setBudgetsInRecoil(result.budgets);
        const currency = await CurrencyOperations.getCurrency();
        setCurrencyInRecoil(currency.symbol);
      }
      setLoading(false);
    } catch (err) {
      if (_maxRetryAttempt > 0) {
        _maxRetryAttempt -= 1;
        await getDataFromDatabase();
        return;
      }
      captureException(err, {
        data: {
          error: 'fn::getDataFromDatabase',
        },
      });
      toast.show(
        'Error pulling data from database,Please restart the app',
        'Fatal',
      );
      setLoading(false);
    }
  };

  const getPreimumStatusOfUser = async () => {
    try {
      const isPremium = await PaymentManager.getActivePermission();
      if (isPremium) {
        if (__DEV__) {
          setPremiumStatusOfUser(false);
        } else {
          setPremiumStatusOfUser(false);
        }
      }
    } catch (err) {}
  };
  const init = () => {
    getPreimumStatusOfUser();
    getDataFromDatabase();
  };
  React.useEffect(() => {
    I18nManager.forceRTL(false);
    init();
    //eslint-disable-next-line  react-hooks/exhaustive-deps
  }, []);
  return loading;
};
