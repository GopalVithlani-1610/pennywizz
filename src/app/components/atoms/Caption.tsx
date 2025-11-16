import React from 'react';
import {Text} from '.';
import {TextProps} from './Text';
import {StyleSheet} from 'react-native';
import {COLORS, SPACING} from '@/app/theme';

export default (props: TextProps) => {
  return <Text {...props} style={styles.captionText} />;
};

const styles = StyleSheet.create({
  captionText: {
    fontSize: 10,
    textAlign: 'center',
    color: COLORS.mediumGray,
    marginVertical: SPACING.sm,
  },
});
