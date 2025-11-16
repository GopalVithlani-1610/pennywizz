import {database} from '@/src/database';
import {TABLES} from '../db.config';
import Category from './models/Category';
import Budget from './models/Budget';
import Transaction from './models/Transaction';
import Payee from './models/Payee';
import Account, {AccountType} from './models/Accounts';

type TableType = typeof TABLES;

const GetDatabaseInstance = function <T>(
  tableName: TableType[keyof TableType],
): T {
  const model = database.collections.get(tableName).modelClass;
  model.collection = database.collections.get(tableName);
  return model as T;
};

export const categoryDatabaseInstance = () =>
  GetDatabaseInstance<typeof Category>(TABLES.Category);
export const budgetDatabaseInstance = () =>
  GetDatabaseInstance<typeof Budget>(TABLES.Budget);
export const transactionDatabaseInstance = () =>
  GetDatabaseInstance<typeof Transaction>(TABLES.Transaction);
export const payeeDatabaseInstance = () =>
  GetDatabaseInstance<typeof Payee>(TABLES.Payee);
export const accountDatabaseInstance = () =>
  GetDatabaseInstance<typeof Account>(TABLES.Account);
export const accountTypeDatabaseInstance = function () {
  const modelClass = GetDatabaseInstance<typeof AccountType>(
    TABLES.AccountType,
  );
  return modelClass;
};

export const prepoulateDatabase = () => {};
