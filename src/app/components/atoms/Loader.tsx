import React from 'react';
import {ActivityIndicator, StyleSheet} from 'react-native';
import Text from './Text';
import {BORDER_RADIUS, COLORS, SPACING} from '@/app/theme';
import CommonStyles from '@/app/styles';
import Animated, {FadeIn} from 'react-native-reanimated';
import Overlay from './Overlay';
import {View} from 'react-native';

type Props = {
  text?: string;
  show: boolean;
};
export default ({show, text = 'Loading...'}: Props) => {
  if (!show) {
    return null;
  }
  return (
    <Overlay>
      <Animated.View entering={FadeIn} style={CommonStyles.center}>
        <View style={styles.container}>
          <ActivityIndicator size={40} color={COLORS.darkPrimary} />
          <Text style={styles.text}>{text}</Text>
        </View>
      </Animated.View>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 10,
    color: COLORS.mediumGray,
    textTransform: 'capitalize',
    marginTop: SPACING.md,
  },
  container: {
    paddingHorizontal: SPACING.custom(4),
    paddingVertical: SPACING.big,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.white,
  },
});
