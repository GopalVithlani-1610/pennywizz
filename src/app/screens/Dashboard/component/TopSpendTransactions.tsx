import {Currency, DashedButton, Pressable, Text} from '@/src/app/components';
import {DateHelper} from '@/src/app/helper';
import {expenseTransactionsState} from '@/src/app/state';
import CommonStyles from '@/src/app/styles';
import {BORDER_RADIUS, COLORS, SPACING} from '@/src/app/theme';
import {
  CategoryEntity,
  TransactionCategoriesLinkEntity,
} from '@/src/types/domainTypes';
import React, {useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {useRecoilValue} from 'recoil';
import {DashboardScreenProps} from '..';

type Props = {
  transaction: {
    amount: number;
    category: CategoryEntity;
    transactionDate?: Date;
  };
  navigation: DashboardScreenProps;
};
export const Card = ({transaction, navigation}: Props) => {
  return (
    <Pressable
      onPress={() =>
        navigation.navigation.navigate('CategoryDetail', {
          categoryName: transaction.category.name,
        })
      }
      style={styles.card}>
      <Text>{transaction.category.emoji}</Text>
      <View style={{flex: 1, marginLeft: SPACING.sm}}>
        <Text textType="normal" style={{flex: 1, fontSize: 12}}>
          {transaction.category.name}
        </Text>
        {transaction.transactionDate && (
          <Text style={{fontSize: 10, color: COLORS.mediumGray}}>
            {DateHelper.formateDateByFormat(
              transaction.transactionDate,
              'DD MMM',
            )}
          </Text>
        )}
      </View>
      <Currency amount={transaction.amount} fontSize={15} />
    </Pressable>
  );
};
type TopSpendTransactionProps = {
  navigation: DashboardScreenProps;
};
export default (props: TopSpendTransactionProps) => {
  const transactions = useRecoilValue(expenseTransactionsState);
  const top5Transactions = useMemo(
    () =>
      Object.assign([] as TransactionCategoriesLinkEntity[], transactions)
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5),
    [transactions],
  );
  if (top5Transactions.length === 0) {
    return (
      <View
        style={{
          paddingHorizontal: SPACING.md,
          marginVertical: SPACING.md,
          gap: SPACING.md,
        }}>
        <Text
          style={{
            fontSize: 10,
            fontStyle: 'italic',
            fontWeight: '500',
            color: COLORS.mediumGray,
          }}>
          👀 {'\t'}Looks like you haven't entered any transactions yet. Start
          tracking today!
        </Text>
        <DashedButton
          text="Create your first transaction"
          onPress={() =>
            props.navigation.navigation.navigate('TransactionEditor')
          }
        />
      </View>
    );
  }
  return (
    <View style={{gap: SPACING.sm}}>
      {top5Transactions.map(transaction => (
        <Card
          key={transaction.id}
          navigation={props.navigation}
          transaction={transaction}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    // borderWidth: StyleSheet.hairlineWidth,
    padding: 10,
    borderRadius: BORDER_RADIUS.sm,
    // borderColor: COLORS.darkPrimary,
    ...CommonStyles.displayRow,
    marginHorizontal: SPACING.sm,
    backgroundColor: COLORS.slightOffWhite,
  },
});
