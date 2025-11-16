import {categoriesState, transactionsByMonthState} from '@/src/app/state';
import React from 'react';
import {View} from 'react-native';
import {useRecoilValue} from 'recoil';
import {Card} from './TopSpendTransactions';
import {useOnlyExpensesCategoriesGrouped} from '../../Spendings/utils';
import {COLORS, SPACING} from '@/src/app/theme';
import {Text} from '@/src/app/components';

export default function PinnedCategories(props) {
  const pinnedCategories = useRecoilValue(categoriesState).filter(
    category => category.isPinned,
  );
  const transactions = useRecoilValue(transactionsByMonthState).filter(
    category =>
      pinnedCategories.findIndex(
        pinnedCategory => category.category.id === pinnedCategory.id,
      ) > -1,
  );

  const pinnedCategoriesTransactions =
    useOnlyExpensesCategoriesGrouped(transactions);

  if (pinnedCategories.length === 0) {
    return (
      <View
        style={{
          paddingHorizontal: SPACING.md,
          marginVertical: SPACING.sm,
          gap: SPACING.md,
        }}>
        <Text
          style={{
            fontSize: 10,
            fontStyle: 'italic',
            fontWeight: '500',
            color: COLORS.mediumGray,
          }}>
          Star your Categories you want Easy Peek 👀 and Quick Access To.🌟
        </Text>
      </View>
    );
  }
  return (
    <View style={{gap: SPACING.sm}}>
      {pinnedCategories.map(pinnedCategory => (
        <Card
          key={pinnedCategory.id}
          transaction={{
            category: pinnedCategory,
            amount:
              pinnedCategoriesTransactions.find(
                c => c.category.id === pinnedCategory.id,
              )?.spend ?? 0,
          }}
          navigation={props.navigation}
        />
      ))}
    </View>
  );
}
