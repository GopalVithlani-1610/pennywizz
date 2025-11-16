import React from 'react';
import {TransitionSpecs, createStackNavigator} from '@react-navigation/stack';
import {NavigationTypes} from '@/src/types';
import {
  ReportScreen,
  SpendingsScreen,
  CategoryDetailScreen,
  SearchScreen,
} from '@/app/screens';
import {HeaderSubScreenTitle} from '../common';
import {FONTS} from '../../theme';

const Stack = createStackNavigator<NavigationTypes.TDetailStackScreen>();

const ReportsTitle = () => <HeaderSubScreenTitle title={'Reports'} />;
export default () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
      }}
      initialRouteName="Spendings$$">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="Spendings$$"
        component={SpendingsScreen}
      />
      <Stack.Screen
        options={{
          headerTitleStyle: {
            left: -18,
            lineHeight: 23,
            fontFamily: FONTS.medium,
          },
          title: 'Transactions',
        }}
        name="CategoryDetail"
        component={CategoryDetailScreen}
      />
      <Stack.Screen
        options={{
          presentation: 'modal',
          transitionSpec: {
            open: TransitionSpecs.BottomSheetSlideInSpec,
            close: TransitionSpecs.BottomSheetSlideOutSpec,
          },
          headerTitle: () => <HeaderSubScreenTitle title="Search" />,
        }}
        component={SearchScreen}
        name="Search"
      />
      <Stack.Screen
        options={{
          headerTitle: ReportsTitle,
        }}
        name="Report"
        component={ReportScreen}
      />
    </Stack.Navigator>
  );
};
