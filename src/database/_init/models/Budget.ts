import {Q, tableSchema} from '@nozbe/watermelondb';
import {field, reader, relation, writer} from '@nozbe/watermelondb/decorators';
import {TABLES} from '../../db.config';
import Category from './Category';
import BaseModel from './BaseModel';
import {BudgetSaveEntity} from '@/src/types/domainTypes';
import {DateHelper} from '@/src/app/helper';

const Columns = {
  amount: 'Amount',
  yearAndMonth: 'YearAndMonth',
  refCategoryId: 'RefCategoryId',
};

export const schema = tableSchema({
  name: TABLES.Budget,
  columns: [
    {
      name: Columns.amount,
      type: 'number',
    },
    {
      name: Columns.yearAndMonth,
      type: 'number',
    },
    {
      name: Columns.refCategoryId,
      type: 'string',
    },
  ],
});

export default class Budget extends BaseModel {
  static table = TABLES.Budget;
  @field(Columns.amount) amount!: number;
  @field(Columns.yearAndMonth) yearAndMonth!: number;
  @relation(TABLES.Category, Columns.refCategoryId) category!: Category;

  @reader static async getCurrentMonthBudgets(yearAndMonth: number) {
    const queryResults = (await this.collection
      .query(Q.where(Columns.yearAndMonth, yearAndMonth))
      .fetch()) as unknown as Budget[];

    return queryResults.map(budget => ({
      amount: budget.amount,
      category: budget.category.id,
      yearAndMonth: budget.yearAndMonth,
    }));
  }

  @writer static async upsertBudgetList(
    transactionDate: Date,
    ...budgets: BudgetSaveEntity[]
  ) {
    const monthAndYear = DateHelper.getCurrentYearAndMonth();
    const existingBudgets = (await this.collection
      .query(
        Q.and(
          Q.where(Columns.yearAndMonth, monthAndYear),
          Q.where(Columns.refCategoryId, Q.oneOf(budgets.map(a => a.category))),
        ),
      )
      .fetch()) as unknown as Budget[];
    const existingBudgetsCategoriesId = existingBudgets.map(a => a.category.id);

    await this.collection.database.batch([
      ...existingBudgets
        .filter(a => a === null || a.amount === 0)
        .map(existing => {
          return existing.prepareDestroyPermanently();
        }),
      ...existingBudgets
        .filter(a => !(a === null || a.amount === 0))
        .map(existing => {
          return existing.prepareUpdate<Budget>(budget => {
            budget.amount =
              budgets.find(a => a.category === budget.category.id)?.amount ?? 0;
          });
        }),
      ...budgets
        .filter(
          budget => !existingBudgetsCategoriesId.includes(budget.category),
        )
        .map(toSave => {
          return this.collection.prepareCreate<Budget>(model => {
            model.amount = toSave.amount;
            model.yearAndMonth =
              DateHelper.getYearAndMonthFromDate(transactionDate);
            //@ts-expect-error
            model.category.id = toSave.category;
          });
        }),
    ]);
  }
}
