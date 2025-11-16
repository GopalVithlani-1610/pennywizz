import React from 'react';
import {View, StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {Pressable, Text} from '../atoms';
import {IconType} from '@/app/assets';
import BhIcon from '@/app/assets/icons';
import CommonStyles from '@/app/styles';
import {useTheme} from '@/app/hooks/useTheme';

type Props = {
  text?: string;
  iconName: IconType;
  onPress: () => void;
  headerRight?: JSX.Element;
  style?: ViewStyle;
  textStyle?: TextStyle;
  iconStyle?: {
    size?: number;
    color?: string;
  };
};

const IconButton = ({
  onPress,
  text,
  iconName,
  headerRight,
  style,
  textStyle,
  iconStyle,
}: Props) => {
  const {colors} = useTheme();
  const defaultIconColor = iconStyle?.color || colors.primary;
  
  return (
    <Pressable
      ripple={CommonStyles.btnRipple}
      animated={false}
      onPress={onPress}
      style={StyleSheet.compose(styles.container, style)}>
      <View style={CommonStyles.displayRow}>
        <BhIcon 
          name={iconName} 
          size={iconStyle?.size || 15} 
          color={defaultIconColor} 
        />
        {typeof text !== 'undefined' && (
          <Text
            textType="normal"
            style={[
              styles.textStyle,
              {color: colors.text.heading},
              typeof textStyle !== 'undefined' ? textStyle : {},
            ]}>
            {text}
          </Text>
        )}
      </View>
      {typeof headerRight !== 'undefined' ? headerRight : null}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textStyle: {
    fontSize: 14,
    marginLeft: 10,
    fontWeight: '500',
  },
});
export default IconButton;
