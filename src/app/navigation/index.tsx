import React from 'react';
import {View} from 'react-native';
import CommonStyles from '../styles';
import BottomTab from './BottomTab';
import OnboardingStack from './ScreenStacks/OnboardingStack';
import {useRecoilValue} from 'recoil';
import {globalAppState} from '@/app/state/utils.state';

const NavigationRoot = () => {
  const isExistingUser = useRecoilValue(globalAppState);
  return (
    <View style={CommonStyles.flex1}>
      {isExistingUser ? <BottomTab /> : <OnboardingStack />}
    </View>
  );
};

export default NavigationRoot;
