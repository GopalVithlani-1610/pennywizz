import {NativeModules, Platform} from 'react-native';
import Utils from '../utils';
const {CustomNativeModule} = NativeModules;

type IAppVersionCallback = (version: string) => void;
class NativeModule {
  static getAppVersion(callback: IAppVersionCallback) {
    if (Platform.OS === 'ios') {
      return '1.2.4';
    }
    CustomNativeModule.getAppVersion(callback);
  }
  static async rateApp() {
    if (Platform.OS === 'android') {
      return CustomNativeModule.rateApp();
    } else if (Platform.OS === 'ios') {
      Utils.invariant(
        Utils.isDevelopmentEnv(),
        'Not implemented In App Review for iOS',
      );
    }
  }

  static reloadApp() {
    return CustomNativeModule.reloadApp();
  }
}

export default NativeModule;
