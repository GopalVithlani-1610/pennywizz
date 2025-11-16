import React, {useState} from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Charts, EmptyScreen} from './components';
import {BORDER_RADIUS, COLORS, SPACING} from '@/app/theme';
import CommonStyles from '@/app/styles';
import {useRecoilValue} from 'recoil';
import {expenseTransactionsState} from '@/app/state';
import {DateHelper} from '@/app/helper';
import {Pressable, Screen, Switch, Text} from '@/app/components';
export default () => {
  const [selectedChartType, setSelectedChartType] = useState<'bar' | 'pie'>(
    'bar',
  );
  const [currentFilter, setCurrentFilter] = useState(0);
  const todayDate = DateHelper.todayDate();
  const expenseTransactions = useRecoilValue(expenseTransactionsState);

  const _buttons = [
    {
      text: 'Till Date',
      range: [DateHelper.subtract(todayDate, todayDate.getDate()), todayDate],
    },
    {
      text: 'Last 7 Days',
      range: [DateHelper.subtract(todayDate, 7), todayDate],
    },
    {
      text: 'Last 15 Days',
      range: [DateHelper.subtract(todayDate, 15), todayDate],
    },
  ];

  if (expenseTransactions.length === 0) {
    return <EmptyScreen />;
  }
  return (
    <Screen>
      <ScrollView>
        <Switch
          style={{alignSelf: 'flex-end', marginTop: SPACING.md}}
          onChange={r => setSelectedChartType(r ? 'pie' : 'bar')}
          iconFirst="barChart"
          iconSecond="spendings"
        />
        <ScrollView
          showsHorizontalScrollIndicator={false}
          horizontal
          keyboardShouldPersistTaps="always"
          fadingEdgeLength={100}
          style={{flexGrow: 0}}
          contentContainerStyle={styles.btnContainer}>
          {_buttons.map((button, index) => (
            <Pressable
              style={[
                styles.filterBtn,
                // eslint-disable-next-line react-native/no-inline-styles
                {
                  borderColor:
                    currentFilter === index ? undefined : COLORS.gray,
                  borderWidth:
                    currentFilter === index ? 0 : StyleSheet.hairlineWidth,
                  borderBottomColor:
                    currentFilter === index ? COLORS.darkPrimary : COLORS.white,
                  borderBottomWidth: currentFilter === index ? 4 : 0,
                },
              ]}
              key={button.text}
              onPress={() => setCurrentFilter(index)}>
              <Text>{button.text}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Charts
          type={selectedChartType}
          from={_buttons[currentFilter].range[0]}
          to={_buttons[currentFilter].range[1]}
        />
      </ScrollView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  btnContainer: {
    gap: SPACING.big,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.big,
    flexGrow: 0,
  },
  filterBtn: {
    padding: SPACING.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.gray,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.white,
    ...CommonStyles.ctaShadow,
    shadowColor: '#999',
  },
});
