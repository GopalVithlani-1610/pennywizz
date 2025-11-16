import BhIcon from '@/src/app/assets/icons';
import {TextInput} from '@/src/app/components';
import CommonStyles from '@/src/app/styles';
import {BORDER_RADIUS, COLORS, SPACING} from '@/src/app/theme';
import React from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import {View, StyleSheet} from 'react-native';

type Props = {
  autoFocus?: boolean;
  style?: StyleProp<ViewStyle>;
  onValueChange?: (d: string) => void;
  clearInput?: boolean;
  placeholder?: string;
};
export default React.memo((props: Props) => {
  const [_value, setValue] = React.useState('');

  React.useEffect(() => {
    if (props.clearInput) {
      setValue('');
    }
  }, [props.clearInput]);
  return (
    <View style={[CommonStyles.displayRow, styles.container, props.style]}>
      <BhIcon size={15} name="search" style={{marginLeft: SPACING.md}} />
      <TextInput
        placeholder={props.placeholder || 'Search...'}
        style={styles.input}
        value={_value}
        onChangeText={d => {
          setValue(d);
          props.onValueChange?.(d);
        }}
        autoFocus={props.autoFocus}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  input: {
    marginLeft: SPACING.sm,
    flex: 1,
    color: COLORS.mediumGray,
  },
  container: {
    borderRadius: BORDER_RADIUS.sm,
    paddingVertical: SPACING.custom(1),
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    paddingHorizontal: SPACING.custom(0.5),
  },
});
