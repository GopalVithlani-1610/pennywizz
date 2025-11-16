import React, {useState} from 'react';
import {View, StyleSheet, StyleProp, ViewStyle} from 'react-native';
import {BORDER_RADIUS, COLORS, SPACING} from '@/app/theme';
import BhIcon, {IconType} from '@/app/assets';
import Pressable from './Pressable';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  iconFirst: IconType;
  iconSecond: IconType;
  onChange?: (n: number) => void;
  style?: StyleProp<ViewStyle>;
};
export default ({iconFirst, iconSecond, onChange, style}: Props) => {
  const [isSet, setIsSet] = useState(0);
  const animatedSharedValue = useSharedValue(0);

  const _onChange = (value: number) => {
    setIsSet(value);
    if (onChange) {
      onChange(value);
    }
    animatedSharedValue.value = withTiming(value);
  };

  const stylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            animatedSharedValue.value,
            [0, 1],
            [0, 48],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });
  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.selectedIndicator, stylez]} />
      <Pressable style={styles.switchItemStyle} onPress={() => _onChange(0)}>
        <BhIcon
          name={iconFirst}
          size={16}
          color={!isSet ? COLORS.white : COLORS.mediumGray}
        />
      </Pressable>
      <Pressable style={styles.switchItemStyle} onPress={() => _onChange(1)}>
        <BhIcon
          name={iconSecond}
          size={16}
          color={isSet ? COLORS.white : COLORS.mediumGray}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    flexDirection: 'row',
    // padding: SPACING.md,
    width: 100,
    borderRadius: SPACING.sm,
    height: 40,
  },
  selectedIndicator: {
    backgroundColor: COLORS.secondry,
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 40,
    margin: 5,
    borderRadius: BORDER_RADIUS.sm,
  },
  switchItemStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
