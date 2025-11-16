export const DBVERSION = 1;
export const DBNAME = 'local_app_database';

export const TABLES = {
  Budget: 'CoreBudget',
  Category: 'RefCategory',
  Transaction: 'CoreTransactions',
  Payee: 'RefPayee',
  Account: 'CoreAccount',
  AccountType: 'RefAccountType',
} as const;

export const MAX_CATERGORY_ALLOWED = 12;
