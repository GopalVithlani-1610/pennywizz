export type BaseEntity = {
  readonly id: string;
};
export type WithBaseEntity<T> = BaseEntity & T;

export type WithoutBaseEntity<T> = Omit<T, 'id'>;
export type AccountEntity = BaseEntity & {
  amount: number;
  accountType: AccountTypeEntity;
  name: string;
};
export type AccountTypeEntity = BaseEntity & {
  name: string;
};
export type PayeeEntity = BaseEntity & {
  name: string;
  isDeleted?: boolean;
};

export type AccountWriteEntity = Omit<
  WithoutBaseEntity<AccountEntity>,
  'accountType'
>;

export type CategoryEntity = BaseEntity & {
  isDeleted: boolean;
  name: string;
  type: 'income' | 'expense';
  emoji: string;
  isPinned?: boolean;
};

export type TransactionEntity = {
  transactionDate: Date;
  amount: number;
  notes?: string;
  category: string;
  account: string;
  payee?: string;
  id: string;
};

export type TransactionCategoriesLinkEntity = Omit<
  TransactionEntity,
  'category'
> & {
  category: CategoryEntity;
};

export type TransactionCategoriesPayeeLinkEntity = Omit<
  TransactionCategoriesLinkEntity,
  'payee'
> & {
  payee?: PayeeEntity;
};

export type BudgetEntity = {
  category: string;
  yearAndMonth: number;
  amount: number;
};

export interface BudgetSaveEntity extends Omit<BudgetEntity, 'yearAndMonth'> {}
