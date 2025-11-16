import {StatsigClientRN} from '@statsig/react-native-bindings';
import {getDeviceId} from 'react-native-device-info';
import {ANALYTICS_KEY} from '@/app/config/keys';

export type TimeTrackTypes = 'TimeToInteract';

export const AnalyticsEventKeys = {
  OnboardingJourney: 'onboarding_journey',
};
export default class AnalyticsManager {
  private static Instance: StatsigClientRN;

  //URGENT: Make GDPR Compliant!
  static initialize() {
    if (this.Instance == null) {
      this.Instance = new StatsigClientRN(ANALYTICS_KEY, {
        userID: this.getOrCreateUserId(),
      });
      this.Instance.initializeAsync();
    }
  }

  //writing it here because for now , we are using analytics id as our userId
  static getOrCreateUserId() {
    return getDeviceId();
  }
  static remoteLog(event: string, options?: Record<string, string>) {
    this.Instance.logEvent(event, undefined, options);
  }

  static startTimeTrack(eventName: TimeTrackTypes) {
    this.Instance.logEvent(eventName, 'Start');
  }
  static endTimeTrack(eventName: TimeTrackTypes) {
    this.Instance.logEvent(eventName, 'End');
  }
}
