import {TransactionCategoriesPayeeLinkEntity} from '@/src/types/domainTypes';
import React, {PropsWithChildren} from 'react';
import {View, StyleSheet} from 'react-native';
import {Pressable, Text} from '../atoms';
import CommonStyles from '@/app/styles';
import {Currency} from '../molecules';
import {BORDER_RADIUS, COLORS, SPACING} from '@/app/theme';
import BhIcon from '@/app/assets';
import {DateHelper} from '../../helper';

type Props = PropsWithChildren & {
  transaction: Partial<TransactionCategoriesPayeeLinkEntity>;
  showCategory?: boolean;
  adaptBgColorBasedOnType?: boolean;
  onPress?: () => void;
};

const TransactionCard = function (props: Props) {
  const {transaction, adaptBgColorBasedOnType, showCategory = true} = props;

  const onPress = () => {
    props.onPress && props.onPress();
  };

  return (
    <Pressable
      onPress={onPress}
      style={StyleSheet.compose(
        styles.container,
        adaptBgColorBasedOnType && {
          borderColor:
            transaction.category?.type === 'expense'
              ? COLORS.red
              : COLORS.greenReport,
          backgroundColor:
            transaction.category?.type === 'expense'
              ? COLORS.lightRed
              : COLORS.lightGreen,
        },
      )}>
      <View
        style={{
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}>
        <View style={{gap: SPACING.sm, flex: 1}}>
          {showCategory && (
            <Text textType="normal" style={styles.categoryName}>
              {transaction.category?.name}
            </Text>
          )}
          <Text style={styles.detailText}>
            {DateHelper.formateDateByFormat(
              transaction.transactionDate!,
              'DD MMM, YYYY',
            )}
          </Text>
          {transaction.payee && (
            <View style={[CommonStyles.displayRow, {gap: SPACING.sm}]}>
              <BhIcon
                style={styles.icon}
                size={12}
                name="user"
                color="#2B4C95"
              />
              <Text style={{fontSize: 12}}>{transaction.payee.name}</Text>
            </View>
          )}
          {transaction.notes && (
            <View style={[CommonStyles.displayRow, {gap: SPACING.sm}]}>
              <BhIcon
                style={styles.icon}
                name="document"
                size={16}
                color={COLORS.darkPrimary}
              />
              <Text style={styles.detailText} numberOfLines={3}>
                {transaction.notes}
              </Text>
            </View>
          )}
        </View>

        <Currency
          amount={transaction.amount!}
          fontSize={16}
          amountTextStyle={{color: COLORS.black}}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: '#DBDBDB',
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    gap: SPACING.sm,
  },
  categoryName: {
    fontSize: 15,
    color: COLORS.subHeadingText,
    flex: 1,
  },
  icon: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.full,
    height: 30,
    width: 30,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  detailText: {fontSize: 12, color: COLORS.mediumGray},
});

export default TransactionCard;
