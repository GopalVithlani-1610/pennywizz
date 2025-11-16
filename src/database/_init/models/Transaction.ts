import {Q, tableSchema} from '@nozbe/watermelondb';
import {
  date,
  field,
  reader,
  readonly,
  relation,
  text,
  writer,
} from '@nozbe/watermelondb/decorators';
import {TABLES} from '@/database/db.config';
import Payee from './Payee';
import Category from './Category';
import BaseModel from './BaseModel';
import {CategoryEntity, TransactionEntity} from '@/src/types/domainTypes';
import Account from './Accounts';
import {DateHelper} from '@/src/app/helper';
import {TransactionModel} from '.';
import {accountDatabaseInstance} from '../collections';

const Columns = {
  notes: 'Notes',
  transactionDate: 'TransactionDate',
  amount: 'Amount',
  refCategoryId: 'RefCategoryId',
  refPayeeId: 'RefPayeeId',
  refAccountId: 'RefAccountId',
  createdAt: 'created_at',
};

export const schema = tableSchema({
  name: TABLES.Transaction,
  columns: [
    {
      name: Columns.notes,
      type: 'string',
      isOptional: true,
    },
    {
      name: Columns.transactionDate,
      type: 'number',
    },
    {
      name: Columns.amount,
      type: 'number',
    },
    {
      name: Columns.refCategoryId,
      type: 'string',
      isIndexed: true,
    },
    {
      name: Columns.refPayeeId,
      type: 'string',
      isOptional: true,
    },
    {
      name: Columns.refAccountId,
      type: 'string',
    },
    {name: Columns.createdAt, type: 'number'},
  ],
});
export default class Transaction extends BaseModel {
  static table = TABLES.Transaction;

  @relation(TABLES.Payee, Columns.refPayeeId) payee: Payee | undefined;
  @text(Columns.notes) notes?: string;
  @date(Columns.transactionDate) transactionDate!: Date;
  @field(Columns.amount) amount!: number;
  @readonly @date(Columns.createdAt) createdAt!: Date;
  @relation(TABLES.Category, Columns.refCategoryId) category!: Category;
  @relation(TABLES.Account, Columns.refAccountId) account!: Account;

  @writer static async deleteTransaction(id: string) {
    const record = await this.collection.find(id);
    //update accounts total with sum.
    if (record != null) {
      await record.destroyPermanently();
    }
  }
  @reader static async getTransactionByAccountId(
    accountId: string,
    transactionDate: number,
  ) {
    this.collection
      .query(
        Q.and(
          Q.where(Columns.refAccountId, accountId),
          Q.where(Columns.transactionDate, transactionDate),
        ),
      )
      .fetch();
  }

  @reader static async getAllTransactionsByAccountId(accountId: string) {
    const transactions = (await this.collection
      .query(
        Q.where(Columns.refAccountId, accountId),
        Q.sortBy(Columns.transactionDate, Q.desc),
      )
      .fetch()) as TransactionModel[];
    return transactions.map(transaction => {
      return {
        amount: transaction.amount,
        category: transaction.category.id,
        transactionDate: transaction.transactionDate,
        notes: transaction.notes,
        id: transaction.id,
        payee: transaction.payee?.id,
      } as TransactionEntity;
    });
  }

  @reader static async getTransactionCountByCategoryId(categoryId: string) {
    return await this.collection
      .query(Q.and(Q.where(Columns.refCategoryId, categoryId)))
      .fetchCount();
  }

  @reader static async getTransactionCountByPayeeId(payeeId: string) {
    return await this.collection
      .query(Q.and(Q.where(Columns.refPayeeId, payeeId)))
      .fetchCount();
  }

  @writer static async getCurrentMonthTransaction(yearAndMonth: number) {
    const [startDate, endDate] =
      DateHelper.getStartAndEndDateForYearMonth(yearAndMonth);
    // Q.unsafeSqlQuery(
    //   "select * from CoreTransactions where _status is not 'deleted' and created_at between ? and ?",
    //   [startDate.getTime(), endDate.getTime()],
    // ),
    const transactions = (await this.collection
      .query(
        Q.where(
          Columns.transactionDate,
          Q.between(startDate.getTime(), endDate.getTime()),
        ),
      )
      .fetch()) as unknown as TransactionModel[];
    return transactions.map(transaction => {
      return {
        amount: transaction.amount,
        category: transaction.category.id,
        transactionDate: transaction.transactionDate,
        notes: transaction.notes,
        id: transaction.id,
        payee: transaction.payee?.id,
        account: transaction.account!.id,
      } as TransactionEntity;
    });
  }

  @reader static async getTransactionsBetweenDate(
    fromDate: Date,
    toDate: Date,
    categoryIds?: string[],
  ) {
    let condition;
    fromDate.setHours(0, 0, 0, 0);
    const toDateModified = new Date(toDate); // this because if we setHours than it will increase the date by 1
    toDateModified.setHours(24, 0, 0, 0);
    if (categoryIds && categoryIds.length > 0) {
      condition = Q.and(
        Q.where(
          Columns.transactionDate,
          Q.between(
            DateHelper.getUnixTimeStampForDate(fromDate),
            DateHelper.getUnixTimeStampForDate(toDateModified),
          ),
        ),
        Q.where(Columns.refCategoryId, Q.oneOf(categoryIds)),
      );
    } else {
      condition = Q.where(
        Columns.transactionDate,
        Q.between(
          DateHelper.getUnixTimeStampForDate(fromDate),
          DateHelper.getUnixTimeStampForDate(toDate),
        ),
      );
    }
    const transactions = (await this.collection
      .query(condition)
      .fetch()) as unknown as TransactionEntity[];
    return transactions.map(transaction => {
      return {
        amount: transaction.amount,
        //@ts-expect-error
        category: transaction.category.id,
        transactionDate: transaction.transactionDate,
        notes: transaction.notes,
        id: transaction.id,
      } as TransactionEntity;
    });
  }
  @writer static async createTransaction(
    transaction: Omit<TransactionEntity, 'id'>,
    category: CategoryEntity,
  ) {
    const newtransaction = this.collection.prepareCreate<Transaction>(m => {
      m.amount = transaction.amount;
      m.transactionDate = transaction.transactionDate;
      m.notes = transaction.notes;
      //@ts-expect-error
      m.category.id = transaction.category;
      //@ts-expect-error
      m.account.id = transaction.account;
      //@ts-expect-error
      m.payee.id = transaction.payee;
    });

    transaction.transactionDate.setHours(0, 0, 0, 0);
    const account = await this.callReader(() =>
      accountDatabaseInstance().getAccountById(transaction.account!),
    );
    const accountModel = accountDatabaseInstance().adjustAccountAmount(
      transaction.amount,
      account,
      category.type === 'income' ? false : true,
    );
    await this.collection.database.batch(accountModel, newtransaction);
    return newtransaction.id;
  }

  @writer static async updateTransaction(
    transactionId: string,
    transaction: Omit<TransactionEntity, 'id'>,
    category: CategoryEntity,
  ) {
    const record = (await this.collection.find(
      transactionId,
    )) as unknown as TransactionModel;
    if (record === null) {
      throw new Error('Transaction not found for corresponding id');
    }
    const transactionAmount = transaction.amount;
    const amountToAdjust = record.amount - transactionAmount;
    const recordAccount = await this.callReader(() =>
      accountDatabaseInstance().getAccountById(record.account.id),
    );

    const recordAccountId = record.account.id;
    transaction.transactionDate.setHours(0, 0, 0, 0);
    const transactionModel = record.prepareUpdate<TransactionModel>(m => {
      m.amount = transaction.amount;
      m.transactionDate = transaction.transactionDate;
      m.notes = transaction.notes;
      //@ts-expect-error
      m.category.id = transaction.category;
      //@ts-expect-error
      m.account.id = transaction.account;
      //@ts-expect-error
      m.payee.id = transaction.payee;
    });
    if (transaction.account !== recordAccountId) {
      const newAccount = await this.callReader(() =>
        accountDatabaseInstance().getAccountById(transaction.account),
      );
      await this.collection.database.batch(
        accountDatabaseInstance().adjustAccountAmount(
          transaction.amount,
          newAccount,
          category.type === 'income' ? false : true,
        ),
        transactionModel,
        accountDatabaseInstance().adjustAccountAmount(
          record.amount,
          recordAccount,
          category.type === 'income' ? true : false,
        ),
      );
    } else {
      const accountModel = accountDatabaseInstance().adjustAccountAmount(
        amountToAdjust,
        recordAccount,
        category.type === 'income' ? false : amountToAdjust < 0,
      );
      await this.collection.database.batch(transactionModel, accountModel);
    }
  }
}
