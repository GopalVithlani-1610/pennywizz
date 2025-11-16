import {Alert} from 'react-native';
import {database, transactionCategoryLinked} from '@/src/database';
import {DateHelper} from '@/src/app/helper';
import {
  budgetDatabaseInstance,
  categoryDatabaseInstance,
  transactionDatabaseInstance,
} from '../_init/collections';
import {captureException} from '@sentry/react-native';
import NotificationManager from '@/src/app/services/NotificationManager';

class CommonOperations {
  static resetDatabase(cb: () => void) {
    Alert.alert(
      'Delete',
      'Your device safeguards your data securely; deleting it means losing valuable information forever.?',
      [
        {
          text: 'Cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            await this.reset();
            cb();
          },
        },
      ],
    );
  }

  static async reset() {
    // unregistering the notification;
    await NotificationManager.cancelFutureNotifications();
    //deleting the watermenlondb;
    return await database.write(async () => {
      await database.unsafeResetDatabase();
    });
  }

  static async getAppData() {
    try {
      const categories = categoryDatabaseInstance().getCategories();
      const transactions =
        transactionDatabaseInstance().getCurrentMonthTransaction(
          DateHelper.getCurrentYearAndMonth(),
        );
      const budgets = budgetDatabaseInstance().getCurrentMonthBudgets(
        DateHelper.getCurrentYearAndMonth(),
      );
      let promise = await Promise.all([categories, transactions, budgets]);

      // grouped here;
      const transactionCategoriesLinked = transactionCategoryLinked(
        promise[1], // transactions
        promise[0], // categories
      );
      return {
        categories: promise[0],
        transactions: transactionCategoriesLinked,
        budgets: promise[2],
      };
    } catch (err) {
      captureException(err, {data: 'fn::getAppData'});
      throw err;
    }
  }
}

export default CommonOperations;
