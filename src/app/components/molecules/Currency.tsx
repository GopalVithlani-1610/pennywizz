import React from 'react';
import {useRecoilValue} from 'recoil';
import {Text} from '../atoms';
import {StyleSheet, ViewStyle} from 'react-native';
import {COLORS, FONTS, SPACING} from '@/app/theme';
import CommonStyles from '@/app/styles';
import {StyleProp, TextStyle, View} from 'react-native';
import {currencyState} from '../../state';

type Props = {
  amount: number;
  fontSize?: number;
  currencyTextStyle?: StyleProp<TextStyle>;
  amountTextStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  showCurrency?: boolean;
  decimalStyle?: StyleProp<TextStyle>;
  highlightIfNegative?: boolean;
};
export default ({
  amount,
  fontSize = 16,
  currencyTextStyle,
  amountTextStyle,
  containerStyle,
  showCurrency = true,
  decimalStyle,
  highlightIfNegative,
}: Props) => {
  const currency = useRecoilValue(currencyState);
  const _amount = amount.formatIntoCurrency();

  return (
    <View style={[CommonStyles.displayRow, containerStyle]}>
      {showCurrency && (
        <Text
          textType="subheading"
          style={[
            styles.currency,
            currencyTextStyle,
            {
              opacity: 0.2,
              fontSize: fontSize * 0.8,
              marginRight: SPACING.custom(0.4),
            },
          ]}>
          {currency}
        </Text>
      )}
      <Text
        style={[
          styles.currencyText,
          {
            fontSize: fontSize,
          },
          amountTextStyle,
          highlightIfNegative &&
            amount < 0 && {color: '#8B0000', fontWeight: '500'},
        ]}>
        {_amount.slice(0, -2)}
        <Text
          style={[
            {
              fontSize: fontSize * 0.8,
              color:
                highlightIfNegative && amount < 0
                  ? '#800000'
                  : COLORS.mediumGray,
            },
            decimalStyle,
          ]}>
          {_amount.slice(-2)}
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  currency: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
    color: COLORS.mediumGray,
  },
  currencyText: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: COLORS.subHeadingText,
    // textAlignVertical: 'center',
  },
});
