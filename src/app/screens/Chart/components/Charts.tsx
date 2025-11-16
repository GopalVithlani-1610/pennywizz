import React, {useEffect, useState} from 'react';
import {View, Dimensions} from 'react-native';
import {SpendingScreenType} from '../../Spendings/utils';
import {useRecoilValue} from 'recoil';
import {expenseTransactionsState} from '@/src/app/state';
import {TransactionCategoriesLinkEntity} from '@/src/types/domainTypes';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryPie,
} from 'victory-native';
import {BORDER_RADIUS, COLORS, SPACING} from '@/src/app/theme';
import ChartLegendInformation from './ChartLegendInformation';

const {width, height} = Dimensions.get('window');

export function colorGenerator() {
  const generated: string[] = [];
  return () => {
    let color = '#';
    while (true) {
      color = '#';
      // Generate each color component
      for (let i = 0; i < 3; i++) {
        // Generate a random value between 0 and 127 (darker colors)
        const value = Math.floor(Math.random() * 200);
        const hex = value.toString(16).padStart(2, '0'); // Convert to hex and ensure two digits
        color += hex;
      }
      if (!generated.includes(color)) {
        break;
      }
    }

    return color;
  };
}

type Props = {
  from: Date;
  to: Date;
  type: 'bar' | 'pie';
};

export type ChartDataType = Omit<
  SpendingScreenType & {color: string},
  'budgeted'
>;

function groupTransactions(transactions: TransactionCategoriesLinkEntity[]) {
  const _transactions: {
    [key: string]: Omit<ChartDataType, 'color'>;
  } = {};
  for (let i = 0; i < transactions.length; i++) {
    const transaction = transactions[i];
    _transactions[transaction.category.id] = {
      category: transaction.category,
      spend:
        transaction.amount +
        (_transactions[transaction.category.id]?.spend ?? 0),
    };
  }
  return Object.assign([], Object.values(_transactions)) as Omit<
    SpendingScreenType,
    'budgeted'
  >[];
}
export default (props: Props) => {
  const generateRandomColor = colorGenerator();
  const expenseTransactions = useRecoilValue(expenseTransactionsState);
  const [currentDataDisplay, setCurrentDataDisplay] = useState<ChartDataType[]>(
    [],
  );
  function filterData(
    _transactions: TransactionCategoriesLinkEntity[],
    timeLine: [Date, Date],
  ) {
    const [startRange, endRange] = timeLine;
    return _transactions.filter(
      transaction =>
        transaction.transactionDate >= startRange &&
        transaction.transactionDate <= endRange,
    );
  }

  useEffect(() => {
    const transactionBetweenRange = filterData(expenseTransactions, [
      props.from,
      props.to,
    ]);
    const transactions = groupTransactions(transactionBetweenRange);
    setCurrentDataDisplay(
      transactions.map(transaction => {
        return {
          ...transaction,
          color: generateRandomColor(),
        };
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenseTransactions, props.from, props.to]);

  if (!currentDataDisplay || currentDataDisplay.length === 0) {
    return null;
  }

  return (
    <>
      <View
        style={{
          backgroundColor: COLORS.slightOffWhite,
          borderRadius: BORDER_RADIUS.sm,
          height: height * 0.4,
        }}>
        {props.type === 'bar' ? (
          <VictoryChart domainPadding={20} width={width - SPACING.md * 2}>
            <VictoryBar
              x="category.name"
              y="spend"
              barWidth={20}
              style={{
                data: {
                  fill: ({index}) =>
                    typeof index === 'number'
                      ? currentDataDisplay[index].color
                      : COLORS.lightGray,
                },
              }}
              cornerRadius={6}
              labels={() => null}
              data={currentDataDisplay}
            />
            <VictoryAxis
              dependentAxis={false} // This makes sure we modify the X-Axis only
              tickFormat={() => ''} // Remove X-Axis labels
            />
            <VictoryAxis
              dependentAxis={true} // This specifies it's the Y-Axis
              style={{tickLabels: {fontSize: 10}}}
            />
          </VictoryChart>
        ) : (
          <VictoryPie
            innerRadius={50}
            colorScale={currentDataDisplay.map(a => a.color)}
            padAngle={2}
            cornerRadius={2}
            data={currentDataDisplay}
            x="category.name"
            y="spend"
            labels={() => null}
            height={height * 0.4}
          />
        )}
      </View>
      <ChartLegendInformation data={currentDataDisplay} />
    </>
  );
};
