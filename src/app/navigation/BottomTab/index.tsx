import React from 'react';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  TransactionEditor,
  AccountScreen,
  PlaygroundScreen,
  SearchScreen,
} from '@/app/screens';
import {BottomTabBar} from './component';
import {SpendingsStack, SettingsStack, DashboardStack} from '../ScreenStacks';
import {NavigationTypes} from '@/src/types';
import {BORDER_RADIUS, COLORS} from '@/app/theme';
import {useGetDBDataOnAppStart} from '@/app/hooks';
import {useTheme} from '@/app/hooks/useTheme';
import AnalyticsManager from '@/app/services/AnalyticsManager';
import {
  StackCardInterpolatedStyle,
  StackCardInterpolationProps,
  createStackNavigator,
} from '@react-navigation/stack';
import {Dimensions, View} from 'react-native';
import {Splash, Text} from '@/app/components';

const BottomTab = createBottomTabNavigator<NavigationTypes.TBottomTabScreens>();
const Stack = createStackNavigator<NavigationTypes.RootStack>();
const BottomTabs = (props: BottomTabBarProps) => <BottomTabBar {...props} />;

const EditorPlaceholder = () => (
  <View>
    <Text>Hello</Text>
  </View>
);
const Tabs = () => {
  const {colors, isDark} = useTheme();
  return (
    <BottomTab.Navigator
      initialRouteName="Dashboard"
      tabBar={BottomTabs}
      screenOptions={{
        headerTitleAlign: 'center',
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: isDark ? colors.iconInactive : '#999',
        headerShown: false,
      }}>
      <BottomTab.Screen
        options={{
          headerShown: false,
        }}
        name="Dashboard"
        component={DashboardStack}
      />
      <BottomTab.Screen name="Spendings" component={SpendingsStack} />

      <BottomTab.Screen
        name="Editor"
        listeners={({navigation}) => {
          return {
            tabPress: e => {
              e.preventDefault();
              navigation.navigate('TransactionEditor');
            },
          };
        }}
        component={EditorPlaceholder}
      />
      <BottomTab.Screen name="Transactions" component={SearchScreen} />
      <BottomTab.Screen name="Accounts" component={AccountScreen} />
    </BottomTab.Navigator>
  );
};

const dimensions = Dimensions.get('window');
const modalHeight = (
  props: StackCardInterpolationProps,
): StackCardInterpolatedStyle => {
  const translateY = props.current.progress.interpolate({
    inputRange: [0, 1],
    outputRange: [props.layouts.screen.height, 0],
    extrapolate: 'clamp',
  });
  return {
    cardStyle: {transform: [{translateY}]},
    overlayStyle: {backgroundColor: 'rgba(0,0,0,0.2)'},
  };
};
export default () => {
  const isStartupDataLoading = useGetDBDataOnAppStart();

  if (isStartupDataLoading) {
    return <Splash show />;
  }
  AnalyticsManager.endTimeTrack('TimeToInteract');

  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="__TABS__">
      <Stack.Screen name="__TABS__" component={Tabs} />
      <Stack.Screen
        name="TransactionEditor"
        options={{
          cardStyle: {
            height: dimensions.height * 0.995,
            backgroundColor: 'transparent',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            borderTopStartRadius: BORDER_RADIUS.md,
            borderTopEndRadius: BORDER_RADIUS.md,
          },
          presentation: 'transparentModal',
          cardOverlayEnabled: true,
          cardStyleInterpolator: modalHeight,
          gestureEnabled: true,
          gestureDirection: 'vertical',
        }}
        component={TransactionEditor}
      />
      <Stack.Screen name="Playground" component={PlaygroundScreen} />
      <Stack.Screen name="Settings" component={SettingsStack} />
    </Stack.Navigator>
  );
};
