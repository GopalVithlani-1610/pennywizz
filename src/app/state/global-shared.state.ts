import {
  BudgetEntity,
  CategoryEntity,
  TransactionCategoriesLinkEntity,
} from '@/src/types/domainTypes';
import {atom, selector} from 'recoil';

export const budgetState = atom<BudgetEntity[]>({
  key: 'state/budgets',
  default: [],
});

/**
 * @description Contains non deleted categories
 */
export const categoriesState = atom<CategoryEntity[]>({
  key: 'state/categories',
  default: [],
});

// initial i will manually update and then by atom changes?
export const transactionsByMonthState = atom<TransactionCategoriesLinkEntity[]>(
  {
    key: 'state/transactionsByMonthState',
    default: [],
  },
);

export const expenseTransactionsState = selector({
  key: 'state/expenseTransactions',
  get: ({get}) => {
    const transactions = get(transactionsByMonthState);
    return transactions.filter(
      transaction => transaction.category.type === 'expense',
    );
  },
});

export const appCurrentMonthAndYearState = atom<{month: number; year: number}>({
  key: 'state/appcurrentmonthandyear',
  default: {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  },
});

export const currencyState = atom({
  key: 'state/currency',
  default: '$',
});
