import {KeyValueStorage} from '../../database';
import {NativeModule} from '../helper';

const MINIMUM_SESSION_FOR_RATE_APP = 10;
export default function useAppReview() {
  const onReview = async () => {
    const totalSessions = await KeyValueStorage.getUserSessions();

    if (totalSessions !== null) {
      if (totalSessions % MINIMUM_SESSION_FOR_RATE_APP === 0) {
        try {
          await NativeModule.rateApp();
        } catch (e) {}
      }
    }
  };
  return {
    callInAppReview: onReview,
  };
}
