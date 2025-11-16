import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationTypes} from '@/src/types';
import {ChartScreen, DashboardScreen} from '@/app/screens';
import {HeaderSubScreenTitle} from '../common';
const Stack = createStackNavigator<NavigationTypes.TDashboardStackScreen>();

export default () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
      }}
      initialRouteName="Dashboard$$">
      <Stack.Screen
        options={{headerShown: false}}
        name="Dashboard$$"
        component={DashboardScreen}
      />
      <Stack.Screen
        options={{
          headerTitle: () => (
            <HeaderSubScreenTitle title="Spendings Overview" />
          ),
        }}
        name="Charts"
        component={ChartScreen}
      />
    </Stack.Navigator>
  );
};
