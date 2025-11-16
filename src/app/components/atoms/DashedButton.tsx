import React from 'react';
import {StyleProp, StyleSheet, TextStyle, ViewStyle} from 'react-native';
import Pressable from './Pressable';
import Text from './Text';
import {BORDER_RADIUS, COLORS, SPACING} from '@/app/theme';

type Props = {
  onPress: () => void;
  text: string;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

export default (props: Props) => {
  return (
    <Pressable
      onPress={props.onPress}
      style={[styles.btnContainer, props.containerStyle]}>
      <Text textType="normal" style={[styles.btnText, props.textStyle]}>
        {props.text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    borderColor: COLORS.lightGray,
    // borderStyle: 'dashed',
    borderWidth: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  btnText: {fontSize: 12, color: COLORS.secondry, textAlign: 'center'},
});
