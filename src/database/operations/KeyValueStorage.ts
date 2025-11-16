import {database} from '@/src/database/db.startup'; // writing this like this because it is creating circular ref?
import {captureException} from '@sentry/react-native';

export const StorageKeys = {
  SESSIONS: 'sessions',
  DAILY_NOTIFICATION_Id: 'dailyNotificationId',
  ONBOARDING_JOURNEY_COMPLETED: 'onboardingJourneyCompleted',
  SYNC_LAST_PULLED_AT: 'lastPulledAt',
  USER_NAME: 'userName',
  THEME_PREFERENCE: 'themePreference',
};

export default class KeyValueStorage {
  static async getUserSessions() {
    const value = await this.get('SESSIONS');
    return value ? +value : 0;
  }
  static async incrementUserSessions() {
    let v = await this.getUserSessions();
    await this.set('SESSIONS', ((v ?? 0) + 1).toString());
  }

  static async get(key: keyof typeof StorageKeys) {
    try {
      return await database.localStorage.get<string>(StorageKeys[key]);
    } catch (_) {
      return null;
    }
  }
  static async set(key: keyof typeof StorageKeys, value: string) {
    try {
      await database.localStorage.set(StorageKeys[key], value);
    } catch (e) {
      captureException(e, {
        data: 'fn:set',
      });
    }
  }
  static async remove(key: keyof typeof StorageKeys) {
    try {
      await database.localStorage.remove(StorageKeys[key]);
    } catch (e) {
      captureException(e, {
        data: 'fn:remove',
      });
    }
  }
}
