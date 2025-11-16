import {Currency, Text} from '@/src/app/components';
import {BORDER_RADIUS, COLORS, SPACING} from '@/src/app/theme';
import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import CommonStyles from '@/src/app/styles';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {ChartDataType} from './Charts';

type Props = {
  data: ChartDataType[];
};

const _numOfItemsPerPage = 3;

const {width} = Dimensions.get('window');
export default (props: Props) => {
  const currentPageSharedValue = useSharedValue(0);
  const _totalPages = Math.ceil(props.data.length / _numOfItemsPerPage);
  const itemWidth = width - (SPACING.md * 2 + SPACING.sm * 2 + 1);
  const onScroll = useAnimatedScrollHandler({
    onScroll: ({contentOffset}) => {
      currentPageSharedValue.value = withTiming(
        Math.round(contentOffset.x / width),
        {duration: 300},
      );
    },
  });
  const stylez = useAnimatedStyle(() => {
    return {
      backgroundColor: COLORS.secondry,
      position: 'absolute',
      width: 5,
      borderRadius: BORDER_RADIUS.sm,
      height: 5,
      transform: [
        {
          translateX: interpolate(
            currentPageSharedValue.value,
            Array.from({length: Math.max(2, _totalPages)}, (_, i) => i),
            Array.from(
              {length: Math.max(2, _totalPages)},
              (_, i) => i * (5 + (SPACING.sm - 4)),
            ),
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });
  return (
    <>
      <View style={styles.billCategoryContainer}>
        <Animated.ScrollView
          snapToAlignment={'center'}
          snapToInterval={itemWidth}
          overScrollMode="never"
          scrollEventThrottle={16}
          bounces={false}
          onScroll={onScroll}
          horizontal>
          {new Array(_totalPages).fill(null).map((_, pageIndex) => {
            const startIndex = pageIndex * _numOfItemsPerPage;
            const endIndex = startIndex + _numOfItemsPerPage;
            const currentData = props.data.slice(startIndex, endIndex);
            return (
              <View key={pageIndex} style={{width: itemWidth}}>
                {currentData.map(pieData => {
                  return (
                    <View
                      key={pieData.category.id}
                      style={styles.pieDataContainer}>
                      <View style={styles.colorDotAndTitleContainer}>
                        <View
                          style={[
                            styles.colorDot,
                            {backgroundColor: pieData.color},
                          ]}
                        />
                        <Text textType="normal" style={styles.billCategory}>
                          {pieData.category.name}
                        </Text>
                      </View>
                      <Currency fontSize={14} amount={pieData.spend} />
                    </View>
                  );
                })}
              </View>
            );
          })}
        </Animated.ScrollView>
      </View>
      {_totalPages >= 2 && (
        <View style={[CommonStyles.displayRow, styles.indicatorContainer]}>
          {new Array(_totalPages).fill(null).map((_, index) => {
            return <View key={index} style={styles.indicatorStyle} />;
          })}
          <Animated.View style={stylez} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  billCategoryContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    marginTop: SPACING.sm,
    borderColor: COLORS.categoryImgBackground,
    paddingHorizontal: SPACING.sm,
  },
  billCategory: {
    color: COLORS.mediumGray,
    fontSize: 14,
  },
  pieDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  indicatorStyle: {
    width: 5,
    height: 5,
    backgroundColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.full,

    // backgroundColor: 'red',
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 12,
    marginHorizontal: SPACING.sm,
  },
  colorDotAndTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  indicatorContainer: {
    gap: SPACING.sm - 4,
    alignSelf: 'center',
    marginTop: SPACING.sm,
  },
});
