import React, {PropsWithChildren} from 'react';
import {
  StyleSheet,
  Text as RNText,
  TextStyle,
  StyleProp,
  type TextProps as RNTextProps,
} from 'react-native';
import {UtilTypes} from '@/src/types';
import {FONTS} from '@/app/theme';
import {useTheme} from '@/app/hooks/useTheme';

export type TextProps = PropsWithChildren & {
  style?: StyleProp<TextStyle>;
  textType?: UtilTypes.TTextType;
  numberOfLines?: number;
};

const Text = ({
  textType = 'normal',
  style,
  numberOfLines,
  children,
  ...props
}: TextProps & RNTextProps) => {
  const {colors} = useTheme();
  
  const getTextColor = () => {
    switch (textType) {
      case 'heading':
        return colors.text.heading;
      case 'subheading':
        return colors.text.subheading;
      case 'normal':
      case 'paragraph':
      default:
        return colors.text.content;
    }
  };

  const getTextStyle = () => {
    const baseStyle: TextStyle = {
      color: getTextColor(),
    };
    
    switch (textType) {
      case 'heading':
        return {
          ...baseStyle,
          fontFamily: FONTS.semiBold,
          fontWeight: '800' as const,
          fontSize: 23,
        };
      case 'subheading':
        return {
          ...baseStyle,
          fontFamily: FONTS.semiBold,
          fontWeight: '600' as const,
        };
      case 'normal':
        return {
          ...baseStyle,
          fontFamily: FONTS.regular,
          fontSize: 15,
        };
      case 'paragraph':
        return {
          ...baseStyle,
          fontFamily: FONTS.regular,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <RNText
      numberOfLines={numberOfLines}
      style={[getTextStyle(), style]}
      allowFontScaling={false}
      {...props}>
      {children}
    </RNText>
  );
};

export default Text;
