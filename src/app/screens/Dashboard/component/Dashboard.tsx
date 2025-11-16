import React, {useMemo, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  Currency,
  Loader,
  MonthYearPicker,
  Portal,
  Pressable,
  Text,
} from '@/app/components';
import {BORDER_RADIUS, COLORS, FONTS, SPACING} from '@/app/theme';
import BhIcon, {IconType} from '@/src/app/assets/icons';
import {
  useRecoilCallback,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import {
  transactionsByMonthState,
  appCurrentMonthAndYearState,
  budgetState,
  categoriesState,
} from '@/src/app/state';

import {DateHelper} from '@/src/app/helper';
import {
  budgetDatabaseInstance,
  transactionCategoryLinked,
  transactionDatabaseInstance,
} from '@/src/database';
import CommonStyles from '@/src/app/styles';
import {DashboardScreenProps} from '..';
import {useUserInteraction} from '@/src/app/hooks';

type SectionProps = {
  type: string;
  amount: number;
  currency: string;
  backgroundColor: string;
  icon: IconType;
};
const Section = (props: SectionProps) => {
  return (
    <View
      style={[
        styles.sectionContainer,
        {backgroundColor: props.backgroundColor},
      ]}>
      <View style={{flex: 1}}>
        <Text textType="normal" style={styles.type}>
          {props.type}
        </Text>
        <View style={styles.currencyContainer}>
          <Currency
            fontSize={20}
            currencyTextStyle={{color: COLORS.slightOffWhite}}
            amount={props.amount}
            amountTextStyle={{fontFamily: FONTS.semiBold, color: COLORS.white}}
            decimalStyle={{color: COLORS.slightOffWhite, marginRight: 10}}
          />
        </View>
      </View>
      <View
        style={{
          backgroundColor: COLORS.white,
          padding: SPACING.sm,
          borderRadius: BORDER_RADIUS.full,
        }}>
        <BhIcon name={props.icon} size={15} color={COLORS.darkGray} />
      </View>
    </View>
  );
};

type Props = {
  currency: string;
  navigation: DashboardScreenProps;
};

export default (props: Props) => {
  const [loading, setLoading] = useState(false);
  const allTransactions = useRecoilValue(transactionsByMonthState);
  const setTransactionByMonth = useSetRecoilState(transactionsByMonthState);
  const setBudgetsByMonth = useSetRecoilState(budgetState);
  const [isMonthYearPickerOpen, setIsMonthYearPickerOpen] = useState(false);
  const userInteraction = useUserInteraction();
  const [currentAppDateState, setCurrentAppDateState] = useRecoilState(
    appCurrentMonthAndYearState,
  );
  const totalBalance = useMemo(() => {
    return allTransactions.reduce(
      (total, transaction) => {
        if (transaction.category.type === 'expense') {
          total.expense = total.expense + transaction.amount;
        } else {
          total.income = total.income + transaction.amount;
        }
        return total;
      },
      {
        income: 0,
        expense: 0,
      },
    );
  }, [allTransactions]);

  const onAppDateChange = useRecoilCallback(
    ({snapshot}) =>
      async (month: number, year: number) => {
        setIsMonthYearPickerOpen(false);
        setLoading(true);
        setCurrentAppDateState({year: year, month: month});
        const monthAndYear = DateHelper.getYearAndMonth(month, year);
        const transactions =
          await transactionDatabaseInstance().getCurrentMonthTransaction(
            monthAndYear,
          );
        const budgets = await budgetDatabaseInstance().getCurrentMonthBudgets(
          monthAndYear,
        );
        const categories = snapshot.getLoadable(categoriesState).contents;
        setTransactionByMonth(
          transactionCategoryLinked(transactions, categories),
        );
        setBudgetsByMonth(budgets);
        setLoading(false);
      },
    [],
  );

  return (
    <>
      <View
        style={[CommonStyles.displayRow, {justifyContent: 'space-between'}]}>
        <Pressable
          animated={false}
          style={styles.monthYearSelectionContainer}
          onPress={() => setIsMonthYearPickerOpen(true)}>
          <Text style={styles.currentMonthAndYearTextStyle}>
            {DateHelper.getMonthForIdx(currentAppDateState.month).substring(
              0,
              3,
            )}{' '}
            <Text style={[styles.currentMonthAndYearTextStyle, {fontSize: 18}]}>
              {currentAppDateState.year}
            </Text>
          </Text>
          <View style={styles.iconContainer}>
            <BhIcon size={8} name="chevron-down" color={COLORS.white} />
          </View>
        </Pressable>
        <View style={[CommonStyles.displayRow, {gap: SPACING.big}]}>
          <Pressable
            onPress={() => {
              props.navigation.navigation.navigate('Charts');
            }}>
            <BhIcon size={16} name="barChart" color={COLORS.darkGray} />
          </Pressable>
          <Pressable
            onPress={() => {
              props.navigation.navigation.navigate('Settings');
            }}>
            <BhIcon size={24} name="settings" color={COLORS.darkGray} />
          </Pressable>
        </View>
      </View>

      <Text style={{marginTop: SPACING.md, fontSize: 12, lineHeight: 25}}>
        {userInteraction?.greet} 🤘🏽 {'\n'}
        <Text textType="normal" style={{color: COLORS.darkGray, fontSize: 20}}>
          {userInteraction?.userName}
        </Text>
      </Text>
      <View style={styles.container}>
        <Text
          style={{
            color: COLORS.mediumGray,
            fontSize: 12,
            fontStyle: 'italic',
            fontWeight: '800',
          }}
          textType="subheading">
          Monthly Overview
        </Text>
        <View
          style={[
            CommonStyles.displayRow,
            {gap: SPACING.md, marginTop: SPACING.sm},
          ]}>
          <Section
            backgroundColor={'#977A34'}
            currency={props.currency}
            type="Expense"
            amount={totalBalance.expense}
            icon="trending-up"
          />
          <Section
            backgroundColor={'#7B3032'}
            currency={props.currency}
            type="Income"
            amount={totalBalance.income}
            icon="trending-down"
          />
        </View>
      </View>
      {isMonthYearPickerOpen && (
        <MonthYearPicker
          initialSelected={currentAppDateState}
          onClose={() => {
            setIsMonthYearPickerOpen(false);
          }}
          onSelect={onAppDateChange}
        />
      )}

      {loading && (
        <Portal>
          <Loader
            show
            text={`teleporting youuu in \n      ${DateHelper.getMonthForIdx(
              currentAppDateState.month,
            )} `}
          />
        </Portal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    // elevation: 1,
    paddingTop: 10,
    paddingBottom: 15,
    // height: '70%',
    gap: SPACING.sm,
    marginTop: 15,
    // paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  type: {
    color: COLORS.slightOffWhite,
    fontSize: 14,
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionContainer: {
    backgroundColor: COLORS.lightGreen,
    padding: 8,
    borderRadius: 10,
    flex: 1,
    gap: SPACING.sm,
    height: 90,
    paddingBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  currentMonthAndYearTextStyle: {
    fontSize: 20,
    fontFamily: FONTS.semiBold,
    lineHeight: 40,
    color: COLORS.darkGray,
  },
  monthYearSelectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  iconContainer: {
    borderColor: COLORS.darkPrimary,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    width: 18,
    height: 18,
    backgroundColor: COLORS.secondry,
  },
});
