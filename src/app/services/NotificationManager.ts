import {Platform} from 'react-native';
import notifee, {RepeatFrequency, TriggerType} from '@notifee/react-native';
import {KeyValueStorage} from '@/src/database';
import {DateHelper} from '../helper';

class NotificationManager {
  #daily_notification_id: any = 'DAILY_NOTIFICATION_Id';

  async setup() {
    if (Platform.OS === 'android') {
      const permissionStatus = await notifee.requestPermission();
      if (!permissionStatus.authorizationStatus) {
        return;
      }
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Transaction Reminder',
      });
      //this would help if we further help with reminder for transactions.
      const onboardingIds = await KeyValueStorage.get(
        this.#daily_notification_id,
      );
      if (onboardingIds) {
        return;
      }
      const todayDate = DateHelper.todayDate();
      //FEATURE : this can be A/B Tested the time parameter.
      const triggerTimestamp = DateHelper.createDate(
        todayDate.getFullYear(),
        todayDate.getMonth(),
        todayDate.getDate() + 1,
      );
      triggerTimestamp.setHours(22, 0, 0, 0);
      const dailyNotificationId = await notifee.createTriggerNotification(
        {
          body: 'Track today’s spending and stay in control!',
          title: 'Expense Alert! 💰',
          android: {
            channelId: channelId,
            pressAction: {
              id: 'default', // open the app on clicked
            },
          },
        },
        {
          repeatFrequency: RepeatFrequency.DAILY,
          timestamp: triggerTimestamp.getTime(),
          type: TriggerType.TIMESTAMP,
        },
      );
      KeyValueStorage.set(this.#daily_notification_id, dailyNotificationId);
    }
  }

  /**
   * @description Safely cancel all the future notifications.
   */
  async cancelFutureNotifications() {
    const id = await KeyValueStorage.get(this.#daily_notification_id);
    if (!id) {
      return;
    }
    return notifee.cancelTriggerNotification(id).catch(_ => {});
  }
}

export default new NotificationManager();
