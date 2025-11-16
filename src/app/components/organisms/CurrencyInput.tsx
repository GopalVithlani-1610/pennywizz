import React, {useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  StyleProp,
  TextStyle,
  ViewStyle,
  StyleSheet,
} from 'react-native';
import {COLORS} from '@/app/theme';
import {useAppAmountInput} from '@/app/hooks';
import {Text} from '../atoms';
import CommonStyles from '@/app/styles';
import {BottomSheetTextInput} from '@gorhom/bottom-sheet';
import {BottomSheetTextInputProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetTextInput';
import {useRecoilValue} from 'recoil';
import {currencyState} from '../../state';

type Props = {
  currencySymbolStyle?: StyleProp<TextStyle>;
  amountTextStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  onInputChange?: (e: number) => void;
  initialValue?: number;
  isWithinBottomSheet?: boolean;
  autoFocused?: boolean;
  onEndSumbiting?: (amount: number) => void;
};

export default (props: Props) => {
  const TextInputComponent = props.isWithinBottomSheet
    ? BottomSheetTextInput
    : TextInput;
  const hiddenInputRef = useRef<
    TextInput | (BottomSheetTextInputProps & TextInput)
  >(null);
  const currencyDs = useAppAmountInput(props.initialValue);
  const currency = useRecoilValue(currencyState);

  const amount = currencyDs.getNumberedValue();
  useEffect(() => {
    props.onInputChange?.(currencyDs.getNumberedValue());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount]);
  return (
    <View style={[CommonStyles.displayRow, props.containerStyle]}>
      <Text
        style={[
          {color: COLORS.secondry, marginRight: 4},
          props.currencySymbolStyle,
        ]}
        textType="heading">
        {currency}
      </Text>
      {/* as RN textinput is controlled component , this causes flickery issue
         when we were converting it into currency.  */}
      <TextInputComponent
        //@ts-expect-error
        ref={hiddenInputRef}
        keyboardType="number-pad"
        onBlur={() => props.onEndSumbiting?.(currencyDs.getNumberedValue())}
        autoFocus={props.autoFocused}
        caretHidden
        value={currencyDs.getNumberedValue().toString()}
        selectionHandleColor={COLORS.white}
        // selectionColor={COLORS.white}
        onKeyPress={({nativeEvent: {key}}) => {
          if (key === 'Backspace') {
            currencyDs.onBackspace();
          }
        }}
        onChangeText={currencyDs.update}
        style={{
          color: COLORS.white,
          fontSize: 0,
          ...StyleSheet.absoluteFillObject,
          zIndex: -23,
          // opacity: 0,
        }}
      />
      <Text
        onPress={() => hiddenInputRef.current?.focus()}
        style={[props.amountTextStyle, {zIndex: 30}]}>
        {currencyDs.readInCurrency()}
      </Text>
    </View>
  );
};
