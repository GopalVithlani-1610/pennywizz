import React from 'react';
import {TransactionCategoriesPayeeLinkEntity} from '@/src/types/domainTypes';
import {PropsWithChildren, createContext, useContext} from 'react';
import {Text} from '.';
import {DateHelper} from '../../helper';
import {View} from 'react-native';
import {StyleSheet} from 'react-native';
import {BORDER_RADIUS, COLORS, SPACING} from '../../theme';
import {Currency} from '..';
import {useTheme} from '../../hooks/useTheme';

const Transaction = createContext<TransactionCategoriesPayeeLinkEntity | null>(
  null,
);

type TransactionCardProps = PropsWithChildren & {
  transaction: TransactionCategoriesPayeeLinkEntity;
};
const TransactionCard = (props: TransactionCardProps) => {
  const {colors} = useTheme();
  return (
    <Transaction.Provider value={props.transaction}>
      <View style={[styles.container, {borderColor: colors.border, backgroundColor: colors.cardBackground}]}>{props.children}</View>
    </Transaction.Provider>
  );
};

function useTransaction() {
  const transactionContext = useContext(Transaction);
  if (!transactionContext) {
    throw new Error('useTransaction should be called inside of context');
  }
  return transactionContext;
}
const TransactionDate = () => {
  const transaction = useTransaction();
  return (
    <Text>
      {DateHelper.formateDateByFormat(
        transaction.transactionDate,
        DateHelper.DateFormats.UI,
      )}
    </Text>
  );
};
const TransactionCategory = () => {
  const transaction = useTransaction();
  return <Text>{transaction.category.name}</Text>;
};
const TransactionNotes = () => {
  const transaction = useTransaction();
  if (!transaction.notes) return null;
  return <Text>{transaction.notes}</Text>;
};
const TransactionPayee = () => {
  const transaction = useTransaction();
  if (!transaction.payee) return null;
  return <Text>{transaction.payee.name}</Text>;
};

const TransactionAmount = () => {
  const transaction = useTransaction();
  const {colors} = useTheme();
  return (
    <Currency
      amount={transaction.amount}
      fontSize={16}
      amountTextStyle={{color: colors.text.heading}}
    />
  );
};

TransactionCard.Category = TransactionCategory;
TransactionCard.Date = TransactionDate;
TransactionCard.Amount = TransactionAmount;
TransactionCard.Notes = TransactionNotes;
TransactionCard.Payee = TransactionPayee;

const styles = StyleSheet.create({
  container: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
});
export default TransactionCard;
