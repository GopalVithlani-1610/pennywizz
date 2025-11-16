import React, {PropsWithChildren} from 'react';
import {
  StyleSheet,
  Text as RNText,
  TextStyle,
  StyleProp,
  type TextProps as RNTextProps,
} from 'react-native';
import {UtilTypes} from '@/src/types';
import {COLORS, FONTS} from '@/app/theme';

export type TextProps = PropsWithChildren & {
  style?: StyleProp<TextStyle>;
  textType?: UtilTypes.TTextType;
  numberOfLines?: number;
};

const returnStyleBasedOnTextType = (textType: TextProps['textType']) => {
  switch (textType) {
    case 'heading':
      return styles.heading;
    case 'subheading':
      return styles.subHeading;
    case 'normal':
      return styles.normal;
    case 'paragraph':
      return styles.paragraph;
  }
};

const Text = ({
  textType = 'normal',
  style,
  numberOfLines,
  children,
  ...props
}: TextProps & RNTextProps) => {
  const stylesBasedOnTextType = returnStyleBasedOnTextType(textType);
  return (
    <RNText
      numberOfLines={numberOfLines}
      style={[stylesBasedOnTextType, style]}
      allowFontScaling={false}
      {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontFamily: FONTS.semiBold,
    // fontFamily: 'InterVariable',
    fontWeight: 800,
    color: COLORS.darkGray,
    fontSize: 23,
  },
  subHeading: {
    fontFamily: FONTS.semiBold,
    color: COLORS.darkGray,
    // fontFamily: 'InterVariable',
    fontWeight: 600,
    // top: 2,
  },
  normal: {
    fontFamily: FONTS.regular,
    color: COLORS.darkGray,
    fontSize: 15,
    // top: 2,
  },
  paragraph: {
    fontFamily: FONTS.regular,
    color: COLORS.darkGray,
  },
});
export default Text;
