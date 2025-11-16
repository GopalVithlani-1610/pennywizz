import React, {PropsWithChildren} from 'react';
import {StyleSheet} from 'react-native';
import {COLORS} from '@/app/theme';
import Animated, {FadeIn} from 'react-native-reanimated';

export default (props: PropsWithChildren) => {
  return (
    <Animated.View entering={FadeIn} style={styles.overlay}>
      {props.children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
  },
});
