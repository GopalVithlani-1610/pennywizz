import React from 'react';
import {
  KeyboardType,
  StyleSheet,
  TextInput as RNTextInput,
  ViewStyle,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import {BORDER_RADIUS, COLORS, FONTS} from '@/app/theme';

type TextInputProps = {
  placeholder: string;
  value: string;
  onChangeText: (value: string) => void;
  style?: ViewStyle;
  keyboardType?: KeyboardType;
  maxLength?: number;
  autoFocus?: boolean;
};
const TextInput = (props: TextInputProps & RNTextInputProps) => {
  return (
    <RNTextInput
      {...props}
      placeholderTextColor={'#DDD'}
      style={[styles.default, props.style]}
      value={props.value}
      onChangeText={props.onChangeText}
      placeholder={props.placeholder}
      selectionColor={COLORS.lightPrimary}
      keyboardType={props.keyboardType || 'default'}
      maxLength={props.maxLength}
      autoFocus={props.autoFocus}
      cursorColor={COLORS.primary}
    />
  );
};
const styles = StyleSheet.create({
  default: {
    fontFamily: FONTS.regular,
    margin: 0,
    padding: 0,
  },
});

export const TextInputStyles = StyleSheet.create({
  //eslint-disable-next-line react-native/no-unused-styles
  inputField: {
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    color: COLORS.black,
  },
  //eslint-disable-next-line react-native/no-unused-styles
  removePadding: {
    margin: 0,
    padding: 0,
  },
});
export default TextInput;
