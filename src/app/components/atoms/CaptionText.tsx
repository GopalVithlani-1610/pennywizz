import React from 'react';
import Text, {type TextProps} from './Text';
import {StyleSheet} from 'react-native';
import {COLORS, SPACING} from '@/app/theme';

export default (props: TextProps & {fontSize?: number}) => {
  return (
    <Text {...props} style={[styles.captionText, {fontSize: props.fontSize}]} />
  );
};

const styles = StyleSheet.create({
  captionText: {
    fontSize: 10,
    textAlign: 'center',
    color: COLORS.mediumGray,
    marginVertical: SPACING.sm,
  },
});
