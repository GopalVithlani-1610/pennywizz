import {DateHelper} from '@/src/app/helper';
import {useAsyncEffect} from '@/src/app/hooks';
import {appCurrentMonthAndYearState, categoriesState} from '@/src/app/state';
import {accountDatabaseInstance} from '@/src/database';
import {
  AccountEntity,
  CategoryEntity,
  TransactionEntity,
} from '@/src/types/domainTypes';
import React, {useEffect} from 'react';
import {useRecoilValue} from 'recoil';

function getCategoryByType(
  categories: CategoryEntity[],
  type: 'expense' | 'income',
) {
  return categories.filter(category => category.type === type);
}

export type TransactionEntryType = {
  transactionDate: Date;
  amount: number;
  notes?: string;
  category?: CategoryEntity;
  payee?: string;
  account?: string;
};
export default function useTransaction(initialData?: TransactionEntity) {
  const isExistingTransaction = initialData !== undefined;
  const allCategories = useRecoilValue(categoriesState);
  const appMonthAndYear = useRecoilValue(appCurrentMonthAndYearState);
  const [selectedSubScreen, setSelectedSubScreen] = React.useState<
    'expense' | 'income'
  >(
    isExistingTransaction
      ? allCategories.find(a => a.id === initialData.category)?.type ??
          'expense'
      : 'expense',
  );
  const [categories, setCategories] = React.useState<CategoryEntity[]>([]);

  const getState = <T extends keyof TransactionEntryType>(
    property: T,
    defaultState: TransactionEntryType[T],
  ) => {
    return isExistingTransaction ? initialData[property] : defaultState;
  };

  const categoriesBySelectedType = getCategoryByType(
    allCategories,
    selectedSubScreen,
  );
  const [transactionEntry, setTransactionEntry] =
    React.useState<TransactionEntryType>({
      transactionDate: getState(
        'transactionDate',
        DateHelper.isDateExistInCurrentMonth(
          appMonthAndYear.month,
          appMonthAndYear.year,
        )
          ? DateHelper.todayDate()
          : new Date(appMonthAndYear.year, appMonthAndYear.month, 1),
      ),
      amount: getState('amount', 0),
      notes: getState('notes', undefined),
      category: isExistingTransaction
        ? categoriesBySelectedType.find(
            a => a.id === getState('category', undefined),
          )!
        : undefined,
      payee: getState('payee', undefined),
      account: getState('account', undefined),
    });
  const [accounts, setAccounts] = React.useState<AccountEntity[]>([]);

  useAsyncEffect(async () => {
    const _accounts = await accountDatabaseInstance().getAllAccounts();
    setAccounts(_accounts);
  }, []);

  useEffect(() => {
    setCategories(getCategoryByType(allCategories, selectedSubScreen));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubScreen]);
  const resetState = () => {
    setTransactionEntry({
      ...transactionEntry,
      transactionDate: DateHelper.todayDate(),
      category: undefined,
    });
  };

  const setTransactionEntryHelper = <T extends keyof TransactionEntryType>(
    property: T,
    value: TransactionEntryType[T],
  ) => {
    const oldTransactionEntry = {
      ...transactionEntry,
      [property]: value,
    };
    setTransactionEntry(oldTransactionEntry);
  };
  return {
    categories,
    selectedSubScreen,
    transactionEntry,
    setTransactionEntry: setTransactionEntryHelper,
    setSelectedSubScreen,
    isEditScreen: isExistingTransaction,
    accounts,
    resetState,
  };
}
