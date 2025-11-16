import {CurrencyInput, Text, TextInput} from '@/src/app/components';
import {currencyState} from '@/src/app/state';
import CommonStyles from '@/src/app/styles';
import {BORDER_RADIUS, COLORS, FONTS, SPACING} from '@/src/app/theme';
import React, {Ref} from 'react';
import {StyleSheet, View} from 'react-native';
import {useRecoilValue} from 'recoil';

type AmountInputSectionProps = {
  type: 'Card' | 'Cash';
};
export type AmountInputRef = {getAmount: () => string};
export const AmountInputSection = React.forwardRef(
  (props: AmountInputSectionProps, ref: Ref<AmountInputRef>) => {
    const [value, setValue] = React.useState('');
    const currencyAtom = useRecoilValue(currencyState);
    React.useImperativeHandle(
      ref,
      () => {
        return {
          getAmount: () => value || '0',
        };
      },
      [value],
    );
    return (
      <View
        style={[
          CommonStyles.displayRow,
          {justifyContent: 'space-between', alignSelf: 'stretch'},
        ]}>
        <Text textType="heading" style={styles.secionTypeText}>
          {props.type}
        </Text>
        <View style={CommonStyles.displayRow}>
          {/* <Text>{currencyAtom}</Text> */}
          <CurrencyInput containerStyle={styles.balanceInput} />
          {/* <TextInput
            placeholder=""
            autoFocus={props.type === 'Card'}
            inputMode="numeric"
            value={value}
            onChangeText={setValue}
          /> */}
        </View>
      </View>
    );
  },
);
const styles = StyleSheet.create({
  secionTypeText: {
    fontSize: 20,
  },
  balanceInput: {
    backgroundColor: COLORS.white,
    width: 100,
    borderRadius: BORDER_RADIUS.sm,
    color: COLORS.black,
    marginLeft: 10,
    fontFamily: FONTS.semiBold,
    ...CommonStyles.ctaShadow,
    textAlign: 'center',
    padding: SPACING.sm,
  },
});
