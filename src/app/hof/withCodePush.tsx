import React from 'react';
import {useEffect} from 'react';
import CodePush, {CodePushOptions} from 'react-native-code-push';

const codePushOptions: CodePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
};

//TODO: shift the keys to the centralized space.
const KEYS = {
  staging: 'no9cJvLiQhHbdqeFboAmDUVVRxYfVLgmRYnzRa',
  production: 'CaGJT0_mGz-9oBks4kvjl4vBRyaYY3e2zJrprk',
};

export default (RootComponent: () => JSX.Element) => {
  const UseRunner = () => {
    useEffect(() => {
      CodePush.sync({
        installMode: CodePush.InstallMode.ON_NEXT_RESTART,
        mandatoryInstallMode: CodePush.InstallMode.ON_NEXT_RESTART,
        deploymentKey: KEYS.production,
      }).catch(_ => {});
    }, []);
    return <RootComponent />;
  };

  return CodePush(codePushOptions)(UseRunner);
};
