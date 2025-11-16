import React from 'react';
import {StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import {UtilTypes} from '@/src/types';
import Text from './Text';
interface Props {
  headerTitle: string;
  headerRight?: JSX.Element;
  style?: ViewStyle;
  textType?: UtilTypes.TTextType;
  textStyle?: TextStyle;
}

const Header = ({
  headerTitle,
  headerRight,
  textType = 'heading',
  style,
  textStyle,
}: Props) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={textStyle} textType={textType}>
        {headerTitle}
      </Text>
      {typeof headerRight !== 'undefined' && headerRight}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
});
export default Header;
