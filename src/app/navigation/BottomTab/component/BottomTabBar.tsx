import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {BORDER_RADIUS, COLORS, SPACING} from '@/app/theme';
import TabIcon from './TabIcon';

export default (props: BottomTabBarProps) => {
  const selectedRoute = props.state.routeNames[props.state.index];

  return (
    <View style={styles.tabContainer}>
      {props.state.routes.map(route => {
        const options = props.descriptors[route.key].options;
        return (
          <TabIcon
            color={
              selectedRoute === route.name
                ? options.tabBarActiveTintColor!
                : options.tabBarInactiveTintColor!
            }
            routeKey={route.key}
            navigation={props.navigation}
            key={route.key}
            tabBarName={route.name as any}
            focused={selectedRoute === route.name}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Platform.OS === 'ios' ? COLORS.white : COLORS.white,
    shadowColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    borderTopStartRadius: BORDER_RADIUS.md,
    borderTopEndRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md - 4,
    // ...CommonStyles.ctaShadow,
  },
});
