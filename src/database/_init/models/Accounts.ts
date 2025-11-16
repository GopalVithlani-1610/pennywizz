import {
  field,
  immutableRelation,
  reader,
  text,
  writer,
} from '@nozbe/watermelondb/decorators';
import {TABLES} from '@/database/db.config';
import BaseModel from './BaseModel';
import {Q, tableSchema} from '@nozbe/watermelondb';
import {AccountEntity, AccountTypeEntity} from '@/src/types';
import {AccountWriteEntity} from '@/src/types/domainTypes';
import {accountTypeDatabaseInstance} from '../collections';

//#region AccountType
const ColumnsAccountType = {
  name: 'Name',
};
export const accountTypeSchema = tableSchema({
  name: TABLES.AccountType,
  columns: [
    {
      name: ColumnsAccountType.name,
      type: 'string',
    },
  ],
});

export class AccountType extends BaseModel {
  static table = TABLES.AccountType;
  @text(ColumnsAccountType.name) name!: string;

  @writer async createAccountType(name: string) {
    this.collection.create<AccountType>(record => {
      record.name = name;
    });
  }

  @reader static async getAccountByName(name: string) {
    return (await this.collection
      .query(Q.where(ColumnsAccountType.name, name))
      .fetch()) as unknown as AccountTypeEntity;
  }
  //FIXME: It will be run on each app start on onboarding stack. since it is non complex query , writing it here.
  //       Can use prepopulation of db.
  @writer static async createCommonAccountType() {
    const exists = await this.collection
      .query(Q.where(ColumnsAccountType.name, 'Checking'))
      .fetchIds();
    if (exists && exists.length > 0) {
      return;
    }
    this.collection.create<AccountType>(a => {
      a.name = 'Checking';
    });
  }
}
//#endregion

//#region Accounts
const Columns = {
  amount: 'Amount',
  accountTypeId: 'AccountType_id',
  name: 'Name',
};
export const accountsSchema = tableSchema({
  name: TABLES.Account,
  columns: [
    {
      name: Columns.amount,
      type: 'number',
    },
    {name: Columns.accountTypeId, type: 'string'},
    {name: Columns.name, type: 'string', isIndexed: true},
  ],
});

export default class Account extends BaseModel {
  static table = TABLES.Account;
  @field(Columns.amount) amount!: number;
  @field(Columns.name) name!: string;
  @immutableRelation(TABLES.AccountType, Columns.accountTypeId)
  accountType!: AccountType;

  //TODO: Can be efficient?. Only one model will be save at a time.
  @writer static async createAccount(models: AccountWriteEntity[]) {
    const alreadyCreatedAccounts = (await this.collection.query(
      Q.where(Columns.name, Q.oneOf(models.map(a => a.name))),
    )) as unknown as AccountTypeEntity[];
    // to handle first bulk save only <=
    if (alreadyCreatedAccounts?.length >= models.length) {
      return Promise.reject(
        `Account ${alreadyCreatedAccounts[0].name} is already present.`,
      );
    }
    const simpleAccountType = await this.callReader(() =>
      accountTypeDatabaseInstance().getAccountByName('Checking'),
    );
    this.collection.database.batch(
      models.map(model =>
        this.collection.prepareCreate<Account>(record => {
          record.amount = model.amount;
          //@ts-expect-error
          record.accountType.id = simpleAccountType.id;
          record.name = model.name;
        }),
      ),
    );
  }
  @reader static async getAllAccounts() {
    let queryResponse = (await this.collection
      .query()
      .fetch()) as unknown as AccountEntity[];
    return queryResponse;
  }

  @writer static async createNewAccount(account: AccountWriteEntity) {
    const simpleAccountType = await this.callReader(() =>
      accountTypeDatabaseInstance().getAccountByName('Checking'),
    );

    //check if the name is already not exists.
    const isExists = await this.collection
      .query(Q.where(Columns.name, account.name))
      .fetchIds();

    if (isExists.length > 0) {
      throw new Error(`Account with name ${account.name} already exists`);
    }
    return this.collection.create<Account>(m => {
      m.amount = account.amount;
      m.name = account.name;
      //@ts-expect-error
      m.accountType.id = simpleAccountType.id;
    });
  }

  @reader static async getAccountById(id: string) {
    const model = (await this.collection.find(id)) as unknown as Account;

    if (model === null) {
      throw new Error(`Account with id ${id} not found`);
    }
    return model as unknown as Account;
  }

  static adjustAccountAmount(amount: number, model: Account, isDeduct = true) {
    return model.prepareUpdate<Account>(update => {
      update.amount = isDeduct
        ? parseFloat((model.amount - amount).toFixed(2))
        : parseFloat((model.amount + amount).toFixed(2));
    });
  }
  @writer static async updateAccount(
    account: AccountWriteEntity & {id: string},
  ) {
    const isExists = await this.collection
      .query(
        Q.and(
          Q.where(Columns.name, account.name),
          Q.where('id', Q.notEq(account.id)),
        ),
      )
      .fetchIds();

    if (isExists.length > 0) {
      throw new Error(`Account with name ${account.name} already exists`);
    }

    const model = await this.collection.find(account.id);

    if (model === null) {
      throw new Error(`Account with id ${account.id} not found`);
    }

    return await model.update<Account>(update => {
      update.name = account.name;
      update.amount = account.amount;
    });
  }
}
//#endregion
