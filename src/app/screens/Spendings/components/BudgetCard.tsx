import {Currency, Text} from '@/src/app/components';
import CommonStyles from '@/src/app/styles';
import {BORDER_RADIUS, COLORS, FONTS, SPACING} from '@/src/app/theme';
import {CategoryEntity} from '@/src/types/domainTypes';
import React, {useCallback, useEffect} from 'react';
import {Dimensions, Pressable} from 'react-native';
import {StyleSheet, View} from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import {useSetRecoilState} from 'recoil';
import {SpendingScreenNavigationProps} from '..';
import {itemLongPressedAtom} from '../utils';
import {NOTEXISTS} from '@/src/app/utils';

type BudgetCardsProps = Pick<SpendingScreenNavigationProps, 'navigation'> & {
  spend: number;
  budgeted: number;
  category: CategoryEntity;
};
const _emojiContainerSize = 40;
const _progressHeight = 5;
const _factorAffectingWidth = SPACING.md * 4;
const width = Dimensions.get('window').width;
export default (props: BudgetCardsProps) => {
  const setItemLongPressedSharedState = useSetRecoilState(itemLongPressedAtom);
  const completedProgressPercent = props.spend / props.budgeted;
  const viewableWidth = width - _factorAffectingWidth;
  const progress = completedProgressPercent * viewableWidth;
  const progressSharedValue = useSharedValue(0);
  const overflowSharedValue = useSharedValue(0);
  const isOverSpent = progress > viewableWidth;
  useEffect(() => {
    progressSharedValue.value = withTiming(Math.min(progress, viewableWidth), {
      duration: 750,
      easing: Easing.inOut(Easing.exp),
    });
    if (progress > viewableWidth) {
      overflowSharedValue.value = withDelay(
        250,
        withTiming(1, {duration: 200}),
      );
    } else {
      if (overflowSharedValue.value === 1) {
        overflowSharedValue.value = withTiming(0, {duration: 200});
      }
    }
  }, [progress, viewableWidth, overflowSharedValue, progressSharedValue]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: _progressHeight,
      backgroundColor: interpolateColor(
        overflowSharedValue.value,
        [0, 1],
        ['#2138bf', '#bf3045'],
      ),
      borderRadius: BORDER_RADIUS.full,
      width: progressSharedValue.value,
      position: 'absolute',
      left: 0,
      justifyContent: 'center',
    };
  });

  const onPress = useCallback(() => {
    props.navigation.navigate('CategoryDetail', {
      categoryName: props.category.name,
    });
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Pressable
      onLongPress={() => {
        setItemLongPressedSharedState(props.category);
      }}
      onPress={onPress}
      style={[
        styles.cardContainer,
        {
          opacity: props.spend === 0 && props.budgeted === NOTEXISTS ? 0.5 : 1,
        },
      ]}>
      <View
        style={[CommonStyles.displayRow, {justifyContent: 'space-between'}]}>
        <View style={[CommonStyles.displayRow, {flex: 1}]}>
          <View style={styles.emojiContainer}>
            <Text style={{elevation: 3}}>{props.category.emoji}</Text>
          </View>
          <View>
            <Text textType="subheading" style={{flex: 1, fontSize: 12}}>
              {props.category.name}
            </Text>
            {props.budgeted !== NOTEXISTS && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  textType="subheading"
                  style={{
                    color: COLORS.mediumGray,
                    fontSize: 10,
                  }}>
                  Left{' '}
                  {parseFloat(
                    (props.budgeted - props.spend).toFixed(2),
                  ).formatIntoCurrency()}{' '}
                  of{' '}
                </Text>
                <Currency
                  amount={props.budgeted}
                  fontSize={10}
                  showCurrency={false}
                  amountTextStyle={{color: COLORS.subHeadingText}}
                  decimalStyle={{color: COLORS.mediumGray}}
                />
              </View>
            )}
          </View>
        </View>
        <View style={CommonStyles.displayRow}>
          <Text textType="heading" style={styles.usedAmountTextStyle}>
            <Currency
              amount={isOverSpent ? -props.spend : props.spend}
              fontSize={14}
            />
          </Text>
        </View>
      </View>

      {props.budgeted !== NOTEXISTS && (
        <View style={styles.progressBarContainer}>
          <Animated.View style={animatedStyle} />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginHorizontal: 1,
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: COLORS.lightGray,
    position: 'relative',
    // borderBottomWidth: 4,
    // borderBottomColor: COLORS.lightGray,
  },
  progressBarContainer: {
    height: _progressHeight,
    backgroundColor: COLORS.categoryImgBackground,
    borderRadius: BORDER_RADIUS.full,
    marginTop: SPACING.sm,
  },
  usedAmountTextStyle: {
    fontSize: 14,
    color: COLORS.black,
    fontFamily: FONTS.medium,
    // lineHeight: 25,
  },
  emojiContainer: {
    backgroundColor: 'rgba(217,217,217,0.26)',
    height: _emojiContainerSize,
    width: _emojiContainerSize,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
    overflow: 'hidden',
  },
});
