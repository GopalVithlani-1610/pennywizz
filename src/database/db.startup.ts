import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import Database from '@nozbe/watermelondb/Database';
import Utils from '../app/utils';
import {DBNAME} from './db.config';
import {
  BudgetModel,
  CategoryModel,
  PayeeModel,
  TransactionModel,
  AccountTypeModel,
  AccountModel,
} from './_init/models';
import schema from './_init/schema';
import migrations from './_init/migrations';
import {captureException} from '@sentry/react-native';

/**
 * @description Database instance.
 */
export let database: Database;

export default function initializeDb() {
  const adapter = new SQLiteAdapter({
    schema,
    jsi: true,
    dbName: DBNAME,
    onSetUpError: er => {
      captureException(er, {data: 'Initialization of database failed'});
      Utils.makeToast(
        'Failed to load database, Kindly Restart the app. ',
        'LONG',
      );
    },
    migrations: migrations,
  });

  database = new Database({
    adapter,
    modelClasses: [
      TransactionModel,
      PayeeModel,
      CategoryModel,
      BudgetModel,
      AccountTypeModel,
      AccountModel,
    ],
  });
}
