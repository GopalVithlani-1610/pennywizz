import {
  Alert,
  Linking,
  PermissionsAndroid,
  ToastAndroid,
  Vibration,
} from 'react-native';
export default class Utils {
  static makeAlert = (
    title: string,
    message: string,
    onOkPress: () => void = () => {},
    showCancel: boolean = false,
    okText: string = 'OK',
  ) => {
    Alert.alert(
      title,
      message,
      [
        {
          text: showCancel ? 'Cancel' : '',
        },
        {text: okText, onPress: onOkPress},
      ],
      {
        cancelable: true,
      },
    );
  };
  static makeToast = (message: string, duration: 'SHORT' | 'LONG' = 'LONG') => {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid[duration],
      ToastAndroid.BOTTOM,
      0,
      20,
    );
  };
  static formatIntoCurrency = (amount: number) => {
    return amount.formatIntoCurrency();
  };
  static generateUUID = () => {
    const randomNumber = Math.round((Math.random() * 1000) / 12).toString();
    return (
      Date.now().toString(36) +
      Math.random().toString(36).substr(2) +
      randomNumber
    );
  };

  static checkOrRequestStoragePermission = async () => {
    const permission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (permission) {
      return true;
    }
    const response = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    );
    if (response === 'granted') {
      return true;
    } else if (response === 'denied') {
      return false;
    } else {
      this.makeAlert(
        'Storage Permission',
        'Need storage permission to download the file.',
        () => {
          Linking.openSettings().catch(_ => {});
        },
        false,
        'Open Settings',
      );
      return false;
    }
  };

  static isValidObject = (object: any): boolean => {
    return typeof object !== 'undefined';
  };

  static isDevelopmentEnv = () => process.env.NODE_ENV === 'development';
  static isProductionEnv = () => process.env.NODE_ENV === 'production';

  static invariant = (cond: boolean, error: string) => {
    if (cond && this.isDevelopmentEnv()) {
      throw new Error(error);
    }
  };
  static isNotNullAndNotEqualsTo = (e: any, notEqTo: any) =>
    typeof e !== 'undefined' && e !== notEqTo;

  static vibrate() {
    Vibration.vibrate(100);
  }
}
export const NOTEXISTS = -27;
