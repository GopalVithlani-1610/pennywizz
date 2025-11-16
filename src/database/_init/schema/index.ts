import {appSchema} from '@nozbe/watermelondb';
import {DBVERSION} from '@/database/db.config';
import {
  accountTypeSchema,
  accountsSchema,
  budgetSchema,
  categorySchema,
  payeeSchema,
  transactionSchema,
} from '../models';

export default appSchema({
  version: DBVERSION,
  tables: [
    transactionSchema,
    categorySchema,
    payeeSchema,
    budgetSchema,
    accountTypeSchema,
    accountsSchema,
  ],
});
