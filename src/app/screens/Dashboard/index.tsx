import React from 'react';
import {View, ScrollView, StatusBar} from 'react-native';
import {useRecoilValue} from 'recoil';
import {Screen} from '@/app/components';
import {currencyState} from '@/app/state';
import {SPACING} from '@/app/theme';
import {
  Dashboard,
  TopSpendTransactions,
  Section,
  PinnedCategories,
  Chart,
} from './component';
import {
  CompositeRootStack,
  TBottomTabScreens,
  TDashboardStackScreen,
  TDetailStackScreen,
} from '@/src/types/navigation';
import {CompositeScreenProps} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {StackScreenProps} from '@react-navigation/stack';

export type DashboardScreenProps = CompositeScreenProps<
  CompositeRootStack<TDashboardStackScreen, 'Dashboard$$'>,
  CompositeScreenProps<
    BottomTabScreenProps<TBottomTabScreens>,
    StackScreenProps<TDetailStackScreen>
  >
>;

export default (props: DashboardScreenProps) => {
  const currency = useRecoilValue(currencyState);
  return (
    <Screen paddingHorizontal={0} paddingBottom={0}>
      <StatusBar backgroundColor={'#FCFDFD'} barStyle={'dark-content'} />
      <ScrollView
        overScrollMode="never"
        contentContainerStyle={{paddingBottom: SPACING.big}}
        showsVerticalScrollIndicator={false}>
        {/* <Gradient fromColor={'#F6D88B'} toColor={'#F6D88B'}> */}
        <View
          style={{
            marginBottom: SPACING.sm,
            paddingHorizontal: SPACING.md,
            marginTop: SPACING.sm,
            // height: height * 0.218,
          }}>
          <Dashboard navigation={props} currency={currency} />
        </View>
        {/* <VictoryPie
                    innerRadius={50}
                    colorScale={currentDataDisplay.map(a => a.color)}
                    padAngle={2}
                    cornerRadius={2}
                    data={currentDataDisplay}
                    x="category.name"
                    y="spend"
                    labels={() => null}
                    height={height * 0.4}
                  /> */}
        {/* </Gradient> */}
        <Chart />
        <View
          style={{
            paddingHorizontal: SPACING.md,
            marginTop: SPACING.big,
            borderTopStartRadius: SPACING.big,
            borderTopEndRadius: SPACING.big,
          }}>
          {/* <Section header="Actions">
            <View
              style={{
                gap: SPACING.sm,
                flexDirection: 'row',
                marginHorizontal: SPACING.sm,
              }}>
              <QuickActions
                icon="testtube"
                iconBgColor={COLORS.slightOffWhite}
                iconColor={COLORS.secondry}
                btnText="Allocate Budget"
                onPress={() =>
                  //@ts-expect-error
                  props.navigation.navigate('Spendings', {
                    screen: 'Spendings$$',
                    params: {
                      open: 'AllocateMoneyModal',
                    },
                  })
                }
              />

              <QuickActions
                iconColor={COLORS.darkPrimary}
                icon="barChart"
                iconBgColor={COLORS.slightOffWhite}
                btnText="Spending overview"
                onPress={() => props.navigation.navigate('Charts')}
              />
            </View>
          </Section> */}
          <Section header="Top Spend Transactions 🫣">
            <TopSpendTransactions navigation={props} />
          </Section>
          <Section header="Starred Categories ⭐️">
            <PinnedCategories navigation={props} />
          </Section>
        </View>
      </ScrollView>
      {/* <View
        style={{
          // marginHorizontal: SPACING.md,
          backgroundColor: 'transparent',
        }}>
        <AddNewTransaction />
      </View> */}
    </Screen>
  );
};
