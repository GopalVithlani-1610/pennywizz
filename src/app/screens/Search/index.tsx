import React, {useMemo, useState, useTransition} from 'react';
import {
  Currency,
  Header,
  Pressable,
  Screen,
  Text,
  TransactionCard,
} from '@/app/components';
import {SearchBar} from '../Spendings/components';
import {BORDER_RADIUS, COLORS, FONTS, SPACING} from '@/app/theme';
import {
  TransactionCategoriesLinkEntity,
  TransactionCategoriesPayeeLinkEntity,
} from '@/src/types/domainTypes';
import {SectionList, View} from 'react-native';
import {useRecoilValue} from 'recoil';
import {
  appCurrentMonthAndYearState,
  transactionsByMonthState,
} from '@/app/state';
import CommonStyles from '@/app/styles';
import {withGetEffect} from '@/app/hof';
import {payeeDatabaseInstance} from '@/src/database';
import {transactionCategoryLinkPayeeLinked} from '@/src/database/utils';
import {useGroupTransactionsByDates as groupByDates} from '../../hooks';
import {DateHelper} from '../../helper';
import {ScrollView} from 'react-native';
import {StyleSheet} from 'react-native';

type SearchCardProps = {
  data: TransactionCategoriesPayeeLinkEntity;
  onPress: (item: TransactionCategoriesPayeeLinkEntity) => void;
};

const Card = (props: SearchCardProps) => {
  return (
    <TransactionCard
      onPress={() => props.onPress(props.data)}
      transaction={props.data}
    />
  );
};

function fillAmountByDates(
  transactions: TransactionCategoriesLinkEntity[],
  totalDays: number,
) {
  let result: number[] = Array(totalDays).fill(null);

  for (let i = 0; i < transactions.length; i++) {
    const date = transactions[i].transactionDate.getDate() - 1; // since storing in array starts at 0;
    result[date] =
      result[date] === null
        ? transactions[i].amount
        : result[date] + transactions[i].amount;
  }
  return result;
}

export default withGetEffect(
  () => payeeDatabaseInstance().getAllPayee(),
  props => {
    const [searchValue, setSearchValue] = useState('');
    const [_, startTransition] = useTransition();
    const [selectedDateFilter, setSelectedDateFilter] = useState(-1);
    const transactions = useRecoilValue(transactionsByMonthState);
    const monthAndYearState = useRecoilValue(appCurrentMonthAndYearState);
    const lastDateOfMonth = DateHelper.getLastDayOfMonth(
      monthAndYearState.month,
      monthAndYearState.year,
    );

    const amountByDate = fillAmountByDates(transactions, lastDateOfMonth);
    const dates = Array(lastDateOfMonth)
      .fill(null)
      .map((_, i) => {
        return {
          text: i + 1,
          amount: amountByDate[i] ?? 0,
        };
      });

    const filteredGroupedDate = (
      data: TransactionCategoriesPayeeLinkEntity[],
    ) => {
      if (!searchValue) {
        return data;
      }
      const _searchLower = searchValue.toLowerCase();
      return data.filter(transaction => {
        const isCategoryMatches = transaction.category.name
          .toLowerCase()
          .includes(_searchLower);
        const isNotesMatches =
          transaction.notes != null &&
          transaction.notes.toLowerCase().includes(_searchLower);
        const isPayeeMatches =
          transaction.payee &&
          transaction.payee.name.toLowerCase().includes(_searchLower);
        return isCategoryMatches || isNotesMatches || isPayeeMatches;
      });
    };
    const linkedTransactionCategory = useMemo(() => {
      const transactionFiltered = filteredGroupedDate(
        transactionCategoryLinkPayeeLinked(
          selectedDateFilter === -1
            ? transactions
            : transactions.filter(
                a => a.transactionDate.getDate() === selectedDateFilter,
              ),
          props.data,
        ),
      );
      return groupByDates(transactionFiltered);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchValue, transactions, props.data, selectedDateFilter]);

    const _onItemPress = (item: TransactionCategoriesPayeeLinkEntity) => {
      const {amount, category, id, transactionDate, account, notes, payee} =
        item;
      props.navigation.navigate('TransactionEditor', {
        amount,
        category: category.id,
        id,
        transactionDate,
        account,
        notes,
        payee: payee?.id,
      });
    };
    return (
      <Screen paddingBottom={0}>
        <Header headerTitle="Transactions" />

        <SearchBar
          onValueChange={e => startTransition(() => setSearchValue(e))}
          placeholder="Search by category type, remarks or payee..."
          style={{
            marginVertical: SPACING.md,
            backgroundColor: COLORS.slightOffWhite,
          }}
        />

        <ScrollView
          horizontal
          style={{flexGrow: 0}}
          contentContainerStyle={{gap: SPACING.md}}>
          {dates.map(date => {
            return (
              <Pressable
                onPress={() => {
                  if (selectedDateFilter === date.text) {
                    setSelectedDateFilter(-1);
                  } else {
                    setSelectedDateFilter(date.text);
                  }
                }}
                key={date.text}
                style={[
                  styles.dateContainer,
                  selectedDateFilter === date.text && {
                    backgroundColor: COLORS.primary,
                  },
                ]}>
                <Text
                  style={[
                    {textAlign: 'center', color: COLORS.mediumGray},
                    selectedDateFilter === date.text && {
                      color: COLORS.white,
                    },
                  ]}>
                  {date.text}
                </Text>
                <Currency
                  containerStyle={[{marginTop: SPACING.sm}]}
                  amount={date.amount}
                  currencyTextStyle={
                    selectedDateFilter === date.text && {
                      color: COLORS.white,
                    }
                  }
                  amountTextStyle={[
                    {fontFamily: FONTS.semiBold},
                    selectedDateFilter === date.text && {
                      color: COLORS.white,
                    },
                  ]}
                  fontSize={12}
                />
              </Pressable>
            );
          })}
        </ScrollView>
        <SectionList
          showsVerticalScrollIndicator={false}
          sections={linkedTransactionCategory}
          style={{flex: 1}}
          contentContainerStyle={{
            gap: SPACING.sm - 2,
            paddingVertical: SPACING.md,
          }}
          renderSectionHeader={({section: {title}}) => (
            <Text textType="subheading" style={styles.sectionTitleText}>
              {title}
            </Text>
          )}
          // data={listData}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <Card onPress={() => _onItemPress(item)} data={item} />
          )}
          ListEmptyComponent={
            <View style={CommonStyles.center}>
              <Text>No results found</Text>
            </View>
          }
        />
      </Screen>
    );
  },
);

const styles = StyleSheet.create({
  dateContainer: {
    // height: 50,
    backgroundColor: COLORS.slightOffWhite,
    borderRadius: BORDER_RADIUS.sm,
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: COLORS.lightPrimary,
    minWidth: 60,
  },
  sectionTitleText: {
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    color: COLORS.darkSecondry,
  },
});
