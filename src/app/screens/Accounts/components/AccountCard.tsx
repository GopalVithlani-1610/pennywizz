import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Currency, Pressable, Text} from '@/app/components';
import {BORDER_RADIUS, COLORS, SPACING} from '@/app/theme';
import {AccountEntity} from '@/src/types';
import BhIcon from '@/src/app/assets/icons';
import CommonStyles from '@/src/app/styles';
type AccountCardProps = {
  account: AccountEntity;
  onAccountPress: (acc: AccountEntity) => void;
};

export function AccountCard(props: AccountCardProps) {
  const {account} = props;

  const onPress = () => {
    props.onAccountPress(props.account);
  };
  return (
    <Pressable onPress={onPress} style={styles.container}>
      {/*<View style={[CommonStyles.displayRow, {marginBottom: SPACING.sm}]}> */}
      {/* <View style={styles.iconStyle}>

        </View> */}
      <View style={[CommonStyles.displayRow, {gap: SPACING.sm}]}>
        <BhIcon
          color={COLORS.secondry}
          size={18}
          name={props.account.name === 'Cash' ? 'currency' : 'card'}
        />
        <Text style={styles.labelText}>{account.name}</Text>
      </View>
      {/* </View> */}
      <Currency
        // amountTextStyle={{flex: 1}}
        fontSize={18}
        highlightIfNegative
        amount={account.amount}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: StyleSheet.hairlineWidth * 1.8,
    backgroundColor: COLORS.white,
    borderColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    ...CommonStyles.displayRow,
    justifyContent: 'space-between',
  },
  labelText: {
    color: COLORS.darkGray,
    fontSize: 15,
    // fontFamily: FONTS.semiBold,
  },
  iconStyle: {
    padding: SPACING.sm,
    backgroundColor: COLORS.secondry,
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
});
