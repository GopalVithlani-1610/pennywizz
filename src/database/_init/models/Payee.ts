import {Q, tableSchema} from '@nozbe/watermelondb';
import {
  date,
  field,
  reader,
  readonly,
  text,
  writer,
} from '@nozbe/watermelondb/decorators';
import {TABLES} from '@/database/db.config';
import BaseModel from './BaseModel';
import {PayeeEntity} from '@/src/types/domainTypes';
import {transactionDatabaseInstance} from '../collections';

const Columns = {
  name: 'Name',
  createdAt: 'created_at',
  isDeleted: 'IsDeleted',
};

export const schema = tableSchema({
  name: TABLES.Payee,
  columns: [
    {
      name: Columns.name,
      type: 'string',
      isIndexed: true,
    },
    {name: Columns.createdAt, type: 'number'},
    {name: Columns.isDeleted, type: 'boolean'},
  ],
});

export default class Payee extends BaseModel {
  static table = TABLES.Payee;
  @text(Columns.name) name!: string;
  @readonly @date(Columns.createdAt) createdAt!: Date;
  @field(Columns.isDeleted) isDeleted?: boolean;

  @reader static async getAllPayee() {
    const data = (await this.collection
      .query(Q.sortBy(Columns.createdAt, Q.desc))
      .fetch()) as unknown as PayeeEntity[];
    return data.map(payee => {
      return {
        id: payee.id,
        name: payee.name,
        isDeleted: payee.isDeleted,
      } as PayeeEntity;
    });
  }

  @writer static async update(payee: PayeeEntity) {
    const record = (await this.collection.find(payee.id)) as unknown as Payee;
    if (record == null) {
      throw new Error('Payee not found.');
    }
    record.update<Payee>(a => {
      a.name = payee.name;
    });
  }

  @reader static async getPayeeByIdList(payeeList: string[]) {
    if (payeeList.length === 0) {
      return Promise.resolve([]);
    }
    const queryResult = (await this.collection.query(
      Q.where('id', Q.oneOf(payeeList)),
    )) as unknown as PayeeEntity[];
    return queryResult.map(payee => {
      return {
        id: payee.id,
        name: payee.name,
      } as PayeeEntity;
    });
  }

  @writer static async deletePayee(payeeId: string) {
    const transactionCount = await this.callReader(() => {
      return transactionDatabaseInstance().getTransactionCountByPayeeId(
        payeeId,
      );
    });
    const record = (await this.collection.find(payeeId)) as unknown as Payee;
    if (record == null) {
      throw new Error('Payee not found.');
    }
    if (transactionCount === 0) {
      return await record.destroyPermanently();
    }
    record.update<Payee>(a => {
      a.isDeleted = true;
    });
  }

  @writer static async createPayee(entity: Omit<PayeeEntity, 'id'>) {
    const payee = await this.collection
      .query(
        Q.and(
          Q.where(Columns.name, entity.name.trim()),
          Q.where(Columns.isDeleted, 0),
        ),
      )
      .fetchCount();
    if (payee > 0) {
      throw new Error('Payee with the same name already exists.');
    }
    const createdPayee = await this.collection.create<Payee>(model => {
      model.name = entity.name;
    });
    return {id: createdPayee.id, name: createdPayee.name} as PayeeEntity;
  }
}
