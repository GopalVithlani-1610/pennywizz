import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationTypes} from '@/src/types';
import {
  OnboardingAmountInsertionScreen,
  OnboardingCategorySelectionScreen,
} from '@/app/screens';
const Stack = createStackNavigator<NavigationTypes.TOnboardingStackScreen>();

export default () => {
  return (
    <Stack.Navigator
      initialRouteName="AmountInsertion"
      screenOptions={{headerShown: false}}>
      <Stack.Screen
        name="AmountInsertion"
        component={OnboardingAmountInsertionScreen}
      />
      <Stack.Screen
        name="CategorySelection"
        component={OnboardingCategorySelectionScreen}
      />
    </Stack.Navigator>
  );
};
