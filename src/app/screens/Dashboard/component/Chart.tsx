import {transactionsByMonthState} from '@/src/app/state';
import {BORDER_RADIUS, COLORS, SPACING} from '@/src/app/theme';
import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {useRecoilValue} from 'recoil';
import {VictoryPie, VictoryTheme} from 'victory-native';
import {colorGenerator} from '../../Chart/components/Charts';
import {PressableTextButton} from '@/src/app/components';

export default () => {
  const generater = colorGenerator();
  const transactions = useRecoilValue(transactionsByMonthState).map(a => {
    return {
      ...a,
      color: generater(),
    };
  });

  if (transactions.length === 0) {
    return null;
  }
  return (
    <View
      style={{
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: COLORS.lightGray,
        borderRadius: BORDER_RADIUS.sm,
        marginHorizontal: SPACING.md,
      }}>
      <View style={styles.headerContainerStyle}>
        <Text style={styles.titleStyle}>Analytics</Text>
        <PressableTextButton
          text="View"
          textStyle={styles.viewInDetailStyle}
          onPress={() => {}}
        />
      </View>
      <View style={styles.chartContainer}>
        <VictoryPie
          theme={VictoryTheme.material}
          colorScale={transactions.map(a => a.color)}
          height={230}
          padAngle={2}
          innerRadius={30}
          // startAngle={90}
          // endAngle={-90}
          // theme={VictoryTheme.material}
          radius={80}
          labels={() => null}
          labelPlacement="perpendicular"
          // labelIndicator
          width={200}
          x="category.name"
          y="amount"
          padding={{left: 20, top: 20, bottom: 20}} // Left padding 0 to shift it left
          data={transactions}
        />
        <View style={styles.legendContainerStyle}>
          {transactions.map(a => {
            return (
              <View style={styles.legendStyle}>
                <View
                  style={[
                    styles.colorIndicatorStyle,
                    {backgroundColor: a.color},
                  ]}
                />
                <Text style={{fontSize: 10}}>{a.category.name}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
  },
  colorIndicatorStyle: {
    width: 20,
    height: 10,
    borderRadius: 2,
  },
  legendStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm - 4,
  },
  legendContainerStyle: {justifyContent: 'center', gap: SPACING.sm - 4},
  headerContainerStyle: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: SPACING.sm,
    marginTop: SPACING.sm,
  },
  titleStyle: {
    color: COLORS.subHeadingText,
    fontSize: 10,
    marginBottom: SPACING.md,
  },
  viewInDetailStyle: {
    fontSize: 14,
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },
});
