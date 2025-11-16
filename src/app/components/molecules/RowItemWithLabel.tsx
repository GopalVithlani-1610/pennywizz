import React, {ReactElement} from 'react';
import {View, StyleSheet, ViewStyle, ViewProps} from 'react-native';
import {BORDER_RADIUS, COLORS, SPACING} from '@/app/theme';
import {Text} from '../atoms';
import CommonStyles from '@/app/styles';
interface Props {
  text: string;
  children: ReactElement;
  childrenStyle?: ViewStyle;
}

const RowItemWithLabel = ({
  text,
  children,
  childrenStyle,
  ...rest
}: Props & ViewProps) => {
  return (
    <View style={[styles.container, CommonStyles.displayRow]} {...rest}>
      <Text textType="subheading" style={styles.textStyle}>
        {text}
      </Text>
      <View style={[styles.valueContainer, childrenStyle]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
    justifyContent: 'space-between',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: BORDER_RADIUS.md,
    borderColor: '#EEE',
    padding: SPACING.sm,
  },
  valueContainer: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    borderColor: '#EEE',
    flex: 1,
    // borderWidth: StyleSheet.hairlineWidth,
  },
  textStyle: {
    color: COLORS.mediumGray,
    fontSize: 10,
    width: 80,
    textTransform: 'uppercase',
  },
});
export default RowItemWithLabel;
