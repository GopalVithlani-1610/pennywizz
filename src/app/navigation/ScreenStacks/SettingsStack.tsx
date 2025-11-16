/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationTypes} from '@/src/types';
import {SettingsScreen, EditScreen} from '@/app/screens';
import {HeaderSubScreenTitle} from '../common';
const Stack = createStackNavigator<NavigationTypes.TSettingStackScreen>();

export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerTitle: () => <HeaderSubScreenTitle title={'Settings'} />,
          headerMode: 'screen',
        }}
        name="Settings$$"
        component={SettingsScreen}
      />
      <Stack.Screen
        options={({route}) => ({
          headerTitle: () => (
            <HeaderSubScreenTitle
              title={route.params.type === 'New' ? 'Create' : 'Edit'}
            />
          ),
        })}
        name="Edit"
        component={EditScreen}
      />
    </Stack.Navigator>
  );
};
