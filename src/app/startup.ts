import {init as initializeSentry, setUser} from '@sentry/react-native';
import {Keys} from './config';
import {OneSignal} from 'react-native-onesignal';
import {PaymentManager} from './helper';
import {ONESIGNAL_KEY} from './config/keys';
import AnalyticsManager from './services/AnalyticsManager';
import NotificationManager from './services/NotificationManager';
import KeyValueStorage from '../database/operations/KeyValueStorage';

initializeSentry({
  dsn: Keys.SENTRY_KEY,
  enableAutoSessionTracking: false,
  environment: __DEV__ ? 'development' : 'production',
  attachStacktrace: true,
});

KeyValueStorage.incrementUserSessions(); // increment user sesssions on every app opens.
intializePlugins();
async function intializePlugins() {
  const userId = AnalyticsManager.getOrCreateUserId();
  setUser({id: userId}); // error sdk userset
  OneSignal.initialize(ONESIGNAL_KEY);
  OneSignal.Notifications.requestPermission(true);
  OneSignal.login(userId); // onesignal user set
  PaymentManager.launchQonversionSDK(userId); // payment managerSet
  NotificationManager.setup();
}
