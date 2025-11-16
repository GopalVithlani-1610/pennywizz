/* eslint-disable react-hooks/rules-of-hooks */
import {atom, useRecoilValue} from 'recoil';
import {
  budgetState,
  categoriesState,
  expenseTransactionsState,
  transactionsByMonthState,
} from '@/app/state';
import {
  CategoryEntity,
  TransactionCategoriesLinkEntity,
} from '@/src/types/domainTypes';
import {NOTEXISTS} from '../../utils';
import {useMemo} from 'react';

export type SpendingScreenType = {
  category: CategoryEntity;
  budgeted: number;
  spend: number;
};

export type BudgetedCategoryType = [
  {
    title: 'Budgeted';
    data: SpendingScreenType[];
  },
  {
    title: 'Spent';
    data: SpendingScreenType[];
  },

  {
    title: 'Unspent';
    data: SpendingScreenType[];
  },
];

/**
 * @description Grouping of categories with budget and total expense transactions . Contains information about all the categories with the total and budgeted amount.
 * @returns `BudgetedCategoryType` Object that contains 2 properties: budgeted and unbudgeted categories with the corresponding total and category budgeted and unbudgeted.
 */
export function useBudgetCategories(): BudgetedCategoryType {
  const budgets = useRecoilValue(budgetState);
  const categories = useRecoilValue(categoriesState);
  const expenseTransactions = useRecoilValue(transactionsByMonthState);

  return useMemo(() => {
    const budgetMaps = new Map();
    for (let i = 0; i < budgets.length; i++) {
      const budget = budgets[i];
      budgetMaps.set(budget.category, budget.amount);
    }
    const result: BudgetedCategoryType = [
      {
        title: 'Budgeted',
        data: [],
      },
      {
        title: 'Spent',
        data: [],
      },
      {
        title: 'Unspent',
        data: [],
      },
    ];
    const transactionSpendMap = new Map<string, number>();
    for (let i = 0; i < expenseTransactions.length; i++) {
      const transaction = expenseTransactions[i];
      let spend: number;
      if (transactionSpendMap.has(transaction.category.id)) {
        const categoryTotal = transactionSpendMap.get(transaction.category.id)!;
        spend = categoryTotal + transaction.amount;
      } else {
        spend = transaction.amount;
      }
      transactionSpendMap.set(transaction.category.id, spend);
    }

    for (
      let categoryLoopIdx = 0;
      categoryLoopIdx < categories.length;
      categoryLoopIdx++
    ) {
      const category = categories[categoryLoopIdx];
      const spend = transactionSpendMap.get(category.id) ?? 0;
      if (budgetMaps.has(category.id)) {
        const resultItem = {
          category: categories.find(c => c.id === category.id)!,
          budgeted: budgetMaps.get(category.id)!,
          spend: spend,
        };
        result[0].data.push(resultItem);
      } else {
        const resultItem = {
          category: categories.find(c => c.id === category.id)!,
          budgeted: NOTEXISTS,
          spend: spend,
        };
        if (spend > 0) {
          result[1].data.push(resultItem);
        } else {
          result[2].data.push(resultItem);
        }
      }
    }
    return result;
  }, [budgets, categories, expenseTransactions]);
}

/**
 * @description Grouped expense transactions with the budget allocated to the underlying category.
 * @param rawTransactions Optional. Transactions to act upon.
 * @returns `SpendingScreenType[]` that contains the category wise grouping of transactions with budgeted
 */
export function useOnlyExpensesCategoriesGrouped(
  rawTransactions?: TransactionCategoriesLinkEntity[],
): SpendingScreenType[] {
  const expenseTransactions =
    rawTransactions ?? useRecoilValue(expenseTransactionsState);
  const budgetRecoilState = useRecoilValue(budgetState);

  return useMemo(() => {
    const transactions: {
      [key: string]: SpendingScreenType;
    } = {};
    for (let i = 0; i < expenseTransactions.length; i++) {
      const transaction = expenseTransactions[i];
      transactions[transaction.category.id] = {
        category: transaction.category,
        budgeted:
          budgetRecoilState.find(c => c.category === transaction.category.id)
            ?.amount ?? NOTEXISTS,
        spend:
          transaction.amount +
          (transactions[transaction.category.id]?.spend ?? 0),
      };
    }
    return Object.assign([], Object.values(transactions));
  }, [expenseTransactions, budgetRecoilState]);
}

export const itemLongPressedAtom = atom<null | CategoryEntity>({
  key: 'moreOptions/default',
  default: null,
});
