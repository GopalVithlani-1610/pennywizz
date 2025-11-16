import React from 'react';
import {View, StyleSheet, StatusBar, FlatList} from 'react-native';
import {transactionsByMonthState} from '@/app/state';
import {useRecoilValue} from 'recoil';
import {
  CaptionText,
  Checkbox,
  Header,
  Screen,
  TransactionCard,
} from '@/app/components';
import {COLORS, SPACING} from '@/app/theme';

export default () => {
  const transactions = useRecoilValue(transactionsByMonthState).filter(
    a => a.category.type === 'expense',
  );
  return (
    <Screen.Onboarding>
      <StatusBar
        backgroundColor={COLORS.lightPrimary}
        barStyle={'light-content'}
      />
      <Header headerTitle="Playground Simulation" />
      <CaptionText>
        Simulating budget behaviour to see if in your budget.
      </CaptionText>
      <CaptionText fontSize={10}>
        NOTE: this will not change/ modify your transactions detail.
      </CaptionText>

      <FlatList
        data={transactions}
        renderItem={({item}) => (
          <View>
            <TransactionCard adaptBgColorBasedOnType transaction={item} />
            <Checkbox value={true} />
          </View>
        )}
        contentContainerStyle={{gap: SPACING.md, paddingVertical: SPACING.big}}
        showsVerticalScrollIndicator={false}
      />
    </Screen.Onboarding>
  );
};

const styles = StyleSheet.create({});
