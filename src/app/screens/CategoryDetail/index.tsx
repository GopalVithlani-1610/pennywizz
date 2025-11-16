import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {View} from 'react-native';
import {NavigationTypes} from '@/src/types';
import {Currency} from '@/app/components';
import CommonStyles from '@/app/styles';
import {SPACING} from '@/app/theme';
import {ListOfBills} from './components';
import {useRecoilValue} from 'recoil';
import {currencyState, transactionsByMonthState} from '@/app/state';

type Props = StackScreenProps<
  NavigationTypes.TDetailStackScreen,
  'CategoryDetail'
>;

export default (props: Props) => {
  const currency = useRecoilValue(currencyState);
  const transactions = useRecoilValue(transactionsByMonthState).filter(
    a => a.category.name === (props.route.params?.categoryName || 'Education'),
  );

  const totalAmount = transactions.reduce((prev, current) => {
    return prev + current.amount;
  }, 0);

  return (
    <View style={CommonStyles.flex1}>
      <Currency
        amount={totalAmount}
        containerStyle={{justifyContent: 'center', padding: SPACING.md}}
        fontSize={36}
      />
      <ListOfBills
        currency={currency}
        navigation={props.navigation as any}
        data={transactions}
      />
    </View>
  );
};
