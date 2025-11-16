import {Q, tableSchema} from '@nozbe/watermelondb';
import {field, reader, text, writer} from '@nozbe/watermelondb/decorators';
import {MAX_CATERGORY_ALLOWED, TABLES} from '../../db.config';
import BaseModel from './BaseModel';
import {CategoryEntity} from '@/src/types/domainTypes';
import {transactionDatabaseInstance} from '../collections';

const Columns = {
  name: 'Name',
  isDeleted: 'IsDeleted',
  emoji: 'Emoji',
  categoryType: 'CategoryType',
  isPinned: 'IsPinned',
};

export const schema = tableSchema({
  name: TABLES.Category,
  columns: [
    {
      name: Columns.name,
      type: 'string',
    },
    {
      name: Columns.isDeleted,
      type: 'number',
    },
    {
      name: Columns.emoji,
      type: 'string',
    },
    {
      name: Columns.categoryType,
      type: 'number',
    },
    {
      name: Columns.isPinned,
      type: 'boolean',
      isOptional: true,
    },
  ],
});

interface CategoryModel {
  name: string;
  isDeleted?: number;
  emoji: string;
  type: number;
  id: string;
  isPinned?: boolean;
}
export default class Category extends BaseModel {
  static table = TABLES.Category;
  @text(Columns.name) name!: string;
  @field(Columns.isDeleted) isDeleted!: number; // for prev records & charts.
  @field(Columns.emoji) emoji!: string;
  @field(Columns.categoryType) type!: number;
  @field(Columns.isPinned) isPinned?: boolean;

  @writer static async saveCategory(model: Omit<CategoryModel, 'id'>) {
    const categoryId = await this.collection
      .query(
        Q.and(Q.where(Columns.name, model.name), Q.where(Columns.isDeleted, 0)),
      )
      .fetchIds();
    if (categoryId.length > 0) {
      throw new Error(
        'Category with name ' + model.name + ' is already exists',
      );
    }

    const noOfCategoriesInDb = await this.collection
      .query(Q.where(Columns.isDeleted, 0))
      .fetchCount();
    if (noOfCategoriesInDb > MAX_CATERGORY_ALLOWED) {
      throw new Error(
        `Maximum ${MAX_CATERGORY_ALLOWED} categories are allowed in free plan.`,
      );
    }
    await this.collection.create<CategoryModel>((m: CategoryModel) => {
      m.name = model.name;
      m.isDeleted = model.isDeleted || 0;
      m.emoji = model.emoji;
      m.type = model.type;
    });
  }

  @writer static async saveCategoryList(models: Partial<CategoryModel>[]) {
    await this.collection.database.batch(
      models.map(model => {
        const prepareCreate = this.collection.prepareCreate<CategoryModel>(
          m => {
            m.name = model.name!;
            m.isDeleted = model.isDeleted || 0;
            m.emoji = model.emoji!;
            m.type = model.type || 0;
          },
        );
        return prepareCreate;
      }),
    );
  }

  @writer static async updateCategory(model: Omit<CategoryEntity, 'type'>) {
    const categoryId = await this.collection
      .query(
        Q.and(Q.where(Columns.name, model.name), Q.where(Columns.isDeleted, 0)),
      )
      .fetchIds();
    if (categoryId.length > 0 && categoryId[0] !== model.id) {
      throw new Error(
        'Category with name ' + model.name + ' is already exists',
      );
    }
    const record = await this.collection.find(model.id);
    if (record == null) {
      throw new Error(`Category with ${model.id} not found.`);
    }

    record.update<Category>(m => {
      m.isDeleted = model.isDeleted ? 1 : 0;
      m.name = model.name;
      m.emoji = model.emoji;
      m.isPinned = model.isPinned;
    });
  }

  @writer static async pinCategory(
    categoryId: string,
    isPinned: boolean = false,
  ) {
    const record = await this.collection.find(categoryId);
    if (record == null) {
      throw new Error(`Category with ${categoryId} not found.`);
    }
    record.update<Category>(m => {
      m.isPinned = isPinned;
    });
  }

  @writer static async deleteCategory(categoryId: string) {
    const record = await this.collection.find(categoryId);
    if (record == null) {
      throw new Error(`Category with ${categoryId} not found.`);
    }

    //to avoid unnecessary category in the database.
    const transactionAgainstCategoryCount = await this.callReader(() => {
      return transactionDatabaseInstance().getTransactionCountByCategoryId(
        categoryId,
      );
    });

    if (transactionAgainstCategoryCount === 0) {
      await record.destroyPermanently();
    } else {
      await record.update<Category>(m => {
        m.isDeleted = 1;
      });
    }
  }

  //FIXME: This returns all the categories from the db .
  //Done cause if the user deleted the category for which we have created the transaction then it will cause an error
  @reader static async getCategories() {
    const categories = (await this.collection
      .query(Q.where(Columns.isDeleted, 0))
      .fetch()) as unknown as CategoryModel[];
    return categories.map(category => {
      return {
        isDeleted: category.isDeleted !== 0,
        type: category.type === 0 ? 'expense' : 'income',
        name: category.name,
        id: category.id,
        emoji: category.emoji,
        isPinned: category.isPinned,
      } as CategoryEntity;
    });
  }
}
