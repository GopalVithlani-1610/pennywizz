import {
  CategoryEntity,
  PayeeEntity,
  TransactionCategoriesLinkEntity,
  TransactionCategoriesPayeeLinkEntity,
  TransactionEntity,
} from '../types/domainTypes';

export const transactionCategoryLinked = (
  transactions: TransactionEntity[],
  categories: CategoryEntity[],
) => {
  return transactions.map(transaction => {
    return {
      ...transaction,
      category: categories.find(
        (a: CategoryEntity) => a.id === transaction.category,
      ),
    } as TransactionCategoriesLinkEntity;
  });
};
export const transactionCategoryPayeeLinked = (
  transactions: TransactionEntity[],
  categories: CategoryEntity[],
  payees: PayeeEntity[],
) => {
  return transactions.map(transaction => {
    return {
      ...transaction,
      category: categories.find(
        (a: CategoryEntity) => a.id === transaction.category,
      ),
      payee: transaction.payee
        ? payees.find(a => a.id === transaction.payee)
        : null,
    } as TransactionCategoriesPayeeLinkEntity;
  });
};

export const transactionCategoryLinkPayeeLinked = (
  transactions: TransactionCategoriesLinkEntity[],
  payees: PayeeEntity[],
) => {
  return transactions.map(transaction => {
    return {
      ...transaction,
      payee: transaction.payee
        ? payees.find(a => a.id === transaction.payee)
        : null,
    } as TransactionCategoriesPayeeLinkEntity;
  });
};

export const categoryTypeAsPerDb = (type: 'expense' | 'income') =>
  type === 'expense' ? 0 : 1;
