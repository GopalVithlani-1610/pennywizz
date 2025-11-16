import React, {useRef} from 'react';
import {
  Animated,
  InteractionManager,
  PressableAndroidRippleConfig,
  Pressable as RNPressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
type Props = {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  animated?: boolean;
  ripple?: PressableAndroidRippleConfig;
  onLongPress?: () => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(RNPressable);
const ANIMATED_DURATION = 70;
const Pressable = ({
  animated = true,
  children,
  onPress,
  style,
  disabled,
  ripple,
}: Props) => {
  const scaleAnimatedValue = useRef(new Animated.Value(0)).current;

  const _onLongPress = () => {
    if (animated === false) {
      onPress();
    } else {
      Animated.timing(scaleAnimatedValue, {
        toValue: 1,
        duration: ANIMATED_DURATION,
        useNativeDriver: true,
      }).start(() => onPress());
    }
  };
  const onPressOut = () => {
    if (!animated) return;
    InteractionManager.runAfterInteractions(() => {
      Animated.timing(scaleAnimatedValue, {
        toValue: 0,
        duration: ANIMATED_DURATION,
        useNativeDriver: true,
      }).start();
    });
  };

  return (
    <AnimatedPressable
      hitSlop={{top: 5, left: 5, right: 5, bottom: 5}}
      android_ripple={ripple}
      onPress={_onLongPress}
      delayLongPress={1000}
      onLongPress={_onLongPress}
      onPressOut={onPressOut}
      disabled={disabled || false}
      style={[
        style,
        {
          transform: [
            {
              scale: scaleAnimatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0.9],
                extrapolate: 'clamp',
              }),
            },
          ],
        },
      ]}>
      {children}
    </AnimatedPressable>
  );
};
export default Pressable;
