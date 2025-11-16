import React from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {COLORS, SPACING} from '@/app/theme';
import Text from './Text';

type Props = {
  loadingText?: string;
  show: boolean;
  backdropColor?: string;
};

export default (props: Props) => {
  const animatedRef = React.useRef(new Animated.Value(0)).current;

  const honeybeeAnimatedRef = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    if (props.show) {
      Animated.timing(animatedRef, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(honeybeeAnimatedRef, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(honeybeeAnimatedRef, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [props.show, animatedRef, honeybeeAnimatedRef]);
  if (!props.show) {
    return null;
  }
  const opacity = animatedRef.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const scaleZ = honeybeeAnimatedRef.interpolate({
    inputRange: [0, 0.5, 0.8, 1],
    outputRange: [0.8, 1, 1.5, 2],
    extrapolate: 'clamp',
  });
  const translateY = honeybeeAnimatedRef.interpolate({
    inputRange: [0, 0.5, 0.8, 1],
    outputRange: [-8, -2, -8, -12],
    extrapolate: 'clamp',
  });
  return (
    <Animated.View style={[styles.wrapper, {opacity}]}>
      <View style={styles.container}>
        <View style={styles.honeyBeeLoaderContainer}>
          <Animated.Text
            style={{
              transform: [
                {scale: 20},
                {
                  rotate: honeybeeAnimatedRef.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            }}>
            🐝
          </Animated.Text>

          <Animated.Text
            style={[
              styles.honeyBeeScaledTextBackground,
              {
                transform: [{scale: scaleZ}, {translateY}],
              },
            ]}>
            🐝
          </Animated.Text>
        </View>
        <Text textType="subheading" style={styles.loadingText}>
          {props.loadingText || 'Loading...'}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...(StyleSheet.absoluteFill as {}),
    // ...CommonStyles.backdrop,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightPrimary,
    zIndex: 1000,
  },
  container: {
    padding: SPACING.big,
    borderRadius: 2,
  },
  loadingText: {
    color: '#000',
    marginTop: 20,
    textAlign: 'center',
  },
  honeyBeeLoaderContainer: {
    borderRadius: 100,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  honeyBeeScaledTextBackground: {
    textShadowRadius: 50,
    textShadowOffset: {
      height: 0,
      width: 0.001,
    },
    textShadowColor: COLORS.primary,
    fontSize: 20,
  },
});
