import {AccountEntity, CategoryEntity} from '@/src/types/domainTypes';
import {TransactionEntryType} from './components';
import {TransactionEditorScreenProps} from '.';

//TODO: Seems unneeded?
class ApplicationError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export function validateTransaction(transaction: TransactionEntryType) {
  if (typeof transaction.amount === 'undefined' || transaction.amount <= 0) {
    throw new ApplicationError('Please fill amount to save transaction.');
  }

  if (!transaction.category || !transaction.category.id) {
    throw new ApplicationError('Please select category');
  }

  if (!transaction.transactionDate) {
    throw new ApplicationError('Please select transaction date');
  }
  if (!/^\d*(\.\d{0,3})?$/.test(transaction.amount.toString())) {
    throw new ApplicationError(
      'Amount should be of type number only and Only 3 Decimal are allowed.',
    );
  }
  if (transaction.amount < 0) {
    throw new ApplicationError("Amount shouldn't be less than zero");
  }
  if (!transaction.account) {
    throw new ApplicationError('Please select account');
  }
}

export type SubScreenProps = {
  isCreate: boolean;
  transactionEntry: TransactionEntryType;
  categories: CategoryEntity[];
  navigation: TransactionEditorScreenProps['navigation'];
  toggleDatePicker: (d: boolean) => void;
  setTransactionEntry: <T extends keyof TransactionEntryType>(
    property: T,
    value: TransactionEntryType[T],
  ) => void;
  accounts: AccountEntity[];
};
