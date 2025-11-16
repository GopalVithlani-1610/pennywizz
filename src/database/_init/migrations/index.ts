import {
  addColumns,
  // addColumns,
  schemaMigrations,
  unsafeExecuteSql,
} from '@nozbe/watermelondb/Schema/migrations';
import {TABLES} from '../../db.config';
// import {DatabaseConfig} from '../../../config';

export default schemaMigrations({
  migrations: [
    // {
    //   toVersion: 2,
    //   steps: [
    //     addColumns({
    //       table: TABLES.Category,
    //       columns: [
    //         {
    //           name: 'is_pinned',
    //           type: 'boolean',
    //           isOptional: true,
    //         },
    //       ],
    //     }),
    //   ],
    // },
    // {
    //   toVersion: 3,
    //   steps: [
    //     unsafeExecuteSql(
    //       'ALTER TABLE ' +
    //         TABLES.Category +
    //         ' RENAME COLUMN is_pinned TO isPinned;',
    //     ),
    //   ],
    // },
    // {
    //   toVersion: 4,
    //   steps: [
    //     addColumns({
    //       table: TABLES.Payee,
    //       columns: [
    //         {
    //           name: 'IsDeleted',
    //           type: 'boolean',
    //           isOptional: true,
    //         },
    //       ],
    //     }),
    //   ],
    // },
  ],
});
