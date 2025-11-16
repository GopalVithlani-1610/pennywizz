import React from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {BORDER_RADIUS, COLORS, FONTS} from '@/app/theme';
import {NavigationTypes} from '@/src/types';
import {IconType} from '@/src/app/assets';
import BhIcon from '@/src/app/assets/icons';
import RNAnimated, {FadeIn, LinearTransition} from 'react-native-reanimated';
import {Text} from '@/src/app/components';
const ICON_SIZE = 15;
type TabBarIconProps = {
  focused: boolean;
  tabBarName: keyof NavigationTypes.TBottomTabScreens;
  color: string;
  routeKey: string;
  navigation: any;
};

const {width} = Dimensions.get('window');

const getIconConfig = (
  type: TabBarIconProps['tabBarName'],
): {name: IconType; size: number} => {
  let defaultSize = ICON_SIZE - 5;
  switch (type) {
    case 'Spendings':
      return {name: 'spendings', size: defaultSize + 5};
    case 'Dashboard':
      return {name: 'dashboard', size: defaultSize + 2};
    case 'Transactions':
      return {name: 'search', size: defaultSize + 5};
    case 'Accounts':
      return {name: 'wallet', size: defaultSize + 5};

    default:
      return {name: 'circleWithPlus', size: defaultSize + 25};
  }
};

export default (props: TabBarIconProps) => {
  const iconConfig = getIconConfig(props.tabBarName);
  // const emoji = getEmojiByTabName(props.tabBarName);
  const onPress = () => {
    const event = props.navigation.emit({
      type: 'tabPress',
      target: props.routeKey,
      canPreventDefault: true,
    });

    if (!props.focused && !event.defaultPrevented) {
      props.navigation.navigate({
        name: props.tabBarName,
        merge: true,
      });
    }
  };

  return (
    <>
      <TouchableOpacity
        activeOpacity={1}
        hitSlop={{
          top: 5,
          left: 8,
          right: 8,
          bottom: 5,
        }}
        onPress={onPress}
        style={styles.container}>
        <RNAnimated.View
          layout={LinearTransition.springify()}
          style={[
            styles.iconContainer,
            props.focused && styles.selected,
            props.tabBarName === 'Editor' && {
              height: 40,
              width: 70,
            },
          ]}>
          <BhIcon
            size={!props.focused ? iconConfig.size : iconConfig.size * 1.2}
            name={iconConfig.name}
            color={props.tabBarName === 'Editor' ? COLORS.primary : props.color}
          />
          {/* <Text>{emoji}</Text> */}
        </RNAnimated.View>
        {!props.focused &&
          Platform.OS !== 'ios' &&
          props.tabBarName !== 'Editor' && (
            <RNAnimated.Text
              style={[
                {
                  fontFamily: props.focused ? FONTS.semiBold : FONTS.regular,
                  color: props.color,
                },
                styles.label,
              ]}>
              {props.tabBarName}
            </RNAnimated.Text>
          )}
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    height: ICON_SIZE + 20,
    width: ICON_SIZE + 20,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
  },
  selected: {
    // color: COLORS.darkPrimary,
  },
  container: {
    width: width / 5,
    alignSelf: 'center',
    flex: 1,
    height: 48,
  },
  label: {
    fontSize: 9.5,
    textAlign: 'center',
    fontFamily: FONTS.medium,
  },
});
