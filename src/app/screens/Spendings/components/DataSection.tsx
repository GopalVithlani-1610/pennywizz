import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {NavigationTypes} from '@/src/types';
import {Text} from '@/app/components';
import CommonStyles from '@/app/styles';
import {COLORS, SPACING} from '@/src/app/theme';
import {BudgetAmountAllocation, BudgetCard} from '.';
import {BudgetedCategoryType, useBudgetCategories} from '../utils';
import {CompositeRootStack} from '@/src/types/navigation';
import Animated, {
  SharedValue,
  useAnimatedScrollHandler,
  withTiming,
} from 'react-native-reanimated';
import {View} from 'react-native';

type SectionProps = {
  title: string;
  data: BudgetedCategoryType[0]['data'];
};
function Section(props: SectionProps) {
  const navigation =
    useNavigation<
      CompositeRootStack<
        NavigationTypes.TDetailStackScreen,
        'Spendings$$'
      >['navigation']
    >();
  return (
    <View style={{paddingTop: SPACING.big, gap: SPACING.sm}}>
      <Text
        textType="subheading"
        style={{
          fontSize: 13,
          marginBottom: SPACING.sm,
          color: COLORS.darkSecondry,
          textTransform: 'uppercase',
        }}>
        {props.title}
      </Text>
      <View style={{gap: SPACING.sm}}>
        {props.data.map(item => (
          <BudgetCard
            key={item.category.id}
            {...item}
            navigation={navigation}
          />
        ))}
      </View>
    </View>
  );
}

type Props = {
  scrollSharedValue: SharedValue<number>;
};

export default (props: Props) => {
  const budgetedCategories = useBudgetCategories();
  // const joinedData = useMemo(() => {
  //   return (budgetedCategories[1].data ?? []).push.apply(
  //     null,
  //     budgetedCategories[0].data,
  //   );
  // }, [budgetedCategories]);

  const animatedScrollHandler = useAnimatedScrollHandler({
    onBeginDrag: (_, c: Record<string, number>) => {
      c.y = 0;
    },
    onScroll: (scroll, prev) => {
      if (scroll.contentOffset.y > prev.y) {
        props.scrollSharedValue.value = withTiming(1);
      } else {
        props.scrollSharedValue.value = withTiming(0);
      }
      prev.y = scroll.contentOffset.y;
    },
    onMomentumEnd: e => {
      if (e.contentOffset.y < 10) {
        props.scrollSharedValue.value = withTiming(0);
      }
    },
  });

  return (
    <Animated.ScrollView
      style={CommonStyles.flex1}
      fadingEdgeLength={50}
      scrollEventThrottle={1000 / 60}
      onScroll={animatedScrollHandler}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        gap: SPACING.sm,
        paddingVertical: SPACING.sm,
      }}
      persistentScrollbar={true}>
      <BudgetAmountAllocation
        routeProps={{params: undefined}}
        scrollSharedValue={props.scrollSharedValue}
      />
      {budgetedCategories.map(budgetCategory => {
        if (budgetCategory.data.length === 0) {
          return null;
        }
        return (
          <Section
            key={budgetCategory.title}
            title={budgetCategory.title}
            data={budgetCategory.data}
          />
        );
      })}
    </Animated.ScrollView>
  );
};
