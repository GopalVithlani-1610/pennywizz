import BhIcon from '@/src/app/assets';
import {
  CurrencyInput,
  FullScreenModal,
  Loader,
  Pressable,
  PressableIconButton,
  Text,
  useToastContext,
} from '@/src/app/components';
import {DateHelper} from '@/src/app/helper';
import {
  appCurrentMonthAndYearState,
  budgetState,
  categoriesState,
} from '@/src/app/state';
import CommonStyles from '@/src/app/styles';
import {BORDER_RADIUS, COLORS, FONTS, SPACING} from '@/src/app/theme';
import {budgetDatabaseInstance} from '@/src/database';
import {NavigationTypes} from '@/src/types';
import {RouteProp} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Keyboard, ScrollView, StyleSheet, View} from 'react-native';
import Animated, {SharedValue, useAnimatedStyle} from 'react-native-reanimated';
import {useRecoilValue, useSetRecoilState} from 'recoil';

type AmountAllocationScreenProps = {
  onUpdateState: (amount: number, category: string) => void;
};
function AmountAllocationScreen(props: AmountAllocationScreenProps) {
  const categories = useRecoilValue(categoriesState).filter(
    a => a.type === 'expense',
  );
  const budgets = useRecoilValue(budgetState);

  return (
    <ScrollView
      contentContainerStyle={{
        marginHorizontal: SPACING.big,
        // gap: SPACING.md,
        paddingVertical: SPACING.md,
        paddingBottom: SPACING.big,
      }}>
      {categories.map(category => (
        <View key={category.id} style={styles.itemContainer}>
          <View style={[CommonStyles.displayRow, {flex: 1, gap: SPACING.sm}]}>
            <Text>{category.emoji}</Text>
            <Text style={{flex: 1}}>{category.name}</Text>
          </View>
          <CurrencyInput
            initialValue={budgets.find(c => c.category === category.id)?.amount}
            onEndSumbiting={amount => props.onUpdateState(amount, category.id)}
            currencySymbolStyle={{fontSize: 13, color: COLORS.mediumGray}}
            containerStyle={styles.input}
          />
        </View>
      ))}
    </ScrollView>
  );
}

type Props = {
  scrollSharedValue: SharedValue<number>;
  routeProps: RouteProp<NavigationTypes.TDetailStackScreen, 'Spendings$$'>;
};

export default (props: Props) => {
  const [changedBudgetedAmount, setChangedBudgetedAmount] = useState<
    {
      amount: number;
      category: string;
    }[]
  >([]);
  const btnClicked = useRef(false);
  const setBudgetRecoil = useSetRecoilState(budgetState);
  const [loading, setLoading] = useState(false);
  const currentAppDate = useRecoilValue(appCurrentMonthAndYearState);
  const toast = useToastContext();
  const [showAmountAllocationScreen, setShowAmountAllocationScreen] =
    useState(false);
  useEffect(() => {
    if (props.routeProps.params && props.routeProps.params.open) {
      setShowAmountAllocationScreen(true);
      //@ts-expect-error
      props.routeProps.params = undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.routeProps.params]);

  useEffect(() => {
    if (btnClicked.current) {
      _saveBudget();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changedBudgetedAmount]);

  const updateChangedState = async (amount: number, id: string) => {
    setChangedBudgetedAmount(existing => {
      const existingCategory = existing.find(c => c.category === id);
      if (existingCategory) {
        return existing.map(c => (c.category === id ? {...c, amount} : c));
      }
      return [...existing, {category: id, amount}];
    });
  };

  const _saveBudget = async () => {
    if (!btnClicked.current) {
      return;
    }
    setLoading(true);
    btnClicked.current = false;
    try {
      await budgetDatabaseInstance().upsertBudgetList(
        DateHelper.createDate(currentAppDate.year, currentAppDate.month, 1),
        ...changedBudgetedAmount,
      );
      const budgets = await budgetDatabaseInstance().getCurrentMonthBudgets(
        DateHelper.getYearAndMonth(currentAppDate.month, currentAppDate.year),
      );
      setBudgetRecoil(budgets); // saving in recoil.
      toast.show('Budgets saved successfully', 'Success');
      setLoading(false);
    } catch (error: any) {
      toast.show(error.message, 'Error');
      setLoading(false);
    }
  };
  const saveBudgets = () => {
    btnClicked.current = true;
    Keyboard.dismiss(); // needed this to manally lose focus.
  };

  const stylez = useAnimatedStyle(() => {
    return {
      // transform: [
      //   {
      //     translateY: interpolate(
      //       props.scrollSharedValue.value,
      //       [0, 1],
      //       [0, 200],
      //     ),
      //   },
      // ],
    };
  });
  return (
    <>
      <Animated.View style={[styles.budgetedButtonContainer, stylez]}>
        <Pressable
          style={styles.actionBtn}
          onPress={() =>
            setShowAmountAllocationScreen(!showAmountAllocationScreen)
          }>
          <Text style={styles.btnText}>Allocate Budget</Text>
          <BhIcon size={12} name="edit-pencil" color={COLORS.darkPrimary} />
        </Pressable>
      </Animated.View>
      {showAmountAllocationScreen && (
        <FullScreenModal
          title="Budget Allocation"
          onModalClose={() => setShowAmountAllocationScreen(false)}>
          <AmountAllocationScreen onUpdateState={updateChangedState} />
          <PressableIconButton
            iconStyle={{color: COLORS.black, size: 15}}
            iconName="check"
            text="Save"
            style={styles.btnActionContainer}
            textStyle={styles.btnText}
            onPress={saveBudgets}
          />
        </FullScreenModal>
      )}

      {loading && <Loader show text="Saving Budget..." />}
    </>
  );
};

const styles = StyleSheet.create({
  actionBtn: {
    backgroundColor: COLORS.lightGray,
    // borderWidth: StyleSheet.hairlineWidth,
    // width: 160,
    borderRadius: BORDER_RADIUS.sm,
    // alignSelf: 'flex-end',
    paddingVertical: SPACING.custom(1.8),
    // borderColor: COLORS.darkPrimary,
    // borderStyle: 'solid',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  btnText: {
    fontFamily: FONTS.semiBold,
    color: COLORS.darkPrimary,
    fontSize: 13,
  },
  budgetedButtonContainer: {
    // marginVertical: SPACING.sm,
    // position: 'absolute',
    // bottom: 0,
    // left: SPACING.md,
    // right: SPACING.md,
    // paddingVertical: SPACING.md,
  },
  itemContainer: {
    ...CommonStyles.displayRow,
    justifyContent: 'space-between',
    padding: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.lightGray,
  },
  input: {
    backgroundColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    fontSize: 18,
    justifyContent: 'center',
    paddingVertical: SPACING.sm + 4,
    flex: 1,
  },
  btnActionContainer: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    width: 120,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    // marginVertical: SPACING.md,
    position: 'absolute',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.darkPrimary,
    bottom: 0,
    marginBottom: SPACING.md,
  },
});
