import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {BORDER_RADIUS, SPACING} from '@/app/theme';
import {useTheme} from '@/app/hooks/useTheme';
import TabIcon from './TabIcon';

export default (props: BottomTabBarProps) => {
  const {colors, isDark} = useTheme();
  const selectedRoute = props.state.routeNames[props.state.index];

  return (
    <View style={[styles.tabContainer, {
      backgroundColor: colors.cardBackground,
      borderTopColor: colors.border,
      shadowColor: isDark ? '#000000' : '#000000',
    }]}>
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
    borderTopWidth: 1,
    borderTopStartRadius: BORDER_RADIUS.md,
    borderTopEndRadius: BORDER_RADIUS.md,
    paddingVertical: SPACING.md - 4,
    ...Platform.select({
      ios: {
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});
