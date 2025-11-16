import React, {useEffect, useRef} from 'react';
import {BackHandler, StyleSheet, View} from 'react-native';
import {DateHelper} from '@/app/helper';
import Animated, {
  Easing,
  FadeInLeft,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Pressable from './Pressable';
import Text from './Text';
import {BORDER_RADIUS, COLORS, FONTS, SPACING} from '@/app/theme';
import Overlay from './Overlay';
import {Portal} from '../portal';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

function getCurrentAndPrevs10Year(): number[] {
  const currentYear = DateHelper.todayDate().getFullYear();
  const tenYearback = currentYear - 9;
  return new Array(10).fill(null).map((_, i) => tenYearback + i);
}

type YearPickerProps = {
  year: number;
  yearSharedValue: SharedValue<number>;
  index: number;
};

function YearPicker(props: YearPickerProps) {
  const timeConfigs = {duration: 200};
  const yearAnimatedStyle = useAnimatedStyle(() => {
    const isSelected = props.year === props.yearSharedValue.value;
    return {
      fontFamily: isSelected ? FONTS.semiBold : FONTS.regular,
      fontSize: isSelected
        ? withTiming(20, timeConfigs)
        : withTiming(16, timeConfigs),
      textAlign: 'center',
      color: isSelected
        ? withTiming(COLORS.black, timeConfigs)
        : withTiming(COLORS.gray, timeConfigs),
      textAlignVertical: 'center',
      width: 60,
    };
  });
  return (
    <Animated.Text
      entering={FadeInLeft.delay(props.index * 50)}
      onPress={() => {
        props.yearSharedValue.value = props.year;
      }}
      style={yearAnimatedStyle}>
      {props.year}
    </Animated.Text>
  );
}
type Props = {
  onClose: () => void;
  onSelect: (month: number, year: number) => void;
  initialSelected?: {month: number; year: number};
};

const _height = 300;
function MonthYearPicker(props: Props) {
  const years = getCurrentAndPrevs10Year();
  const monthScrollRef = useRef<Animated.ScrollView>(null);
  const currentYear = years[years.length - 1]; //since last element will be the current device month
  const currentYearSelectedSharedValue = useSharedValue(
    props.initialSelected?.year || currentYear,
  );
  const panSharedValue = useSharedValue(_height);
  const [selectedMonthIndex, setSelectedMonthIndex] = React.useState<
    number | null
  >(props.initialSelected?.month || null);

  useEffect(() => {
    panSharedValue.value = withTiming(0, {
      easing: Easing.linear,
      duration: 250,
    });

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        props.onClose();
        return true;
      },
    );
    return () => {
      backHandler.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panSharedValue]);
  const onClose = () => {
    if (selectedMonthIndex !== null) {
      props.onSelect(selectedMonthIndex, currentYearSelectedSharedValue.value);
    }
    props.onClose();
  };

  const nativeGesture = Gesture.Native();
  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      if (event.translationY > 0) {
        return; //over pan gesture
      }
      const translationY = -event.translationY;
      panSharedValue.value = withTiming(translationY, {
        duration: 100,
        easing: Easing.bezier(0.19, 1, 0.22, 1),
      });
    })
    .onEnd(event => {
      if (event.translationY < _height / 2) {
        panSharedValue.value = withSpring(_height, {stiffness: 200});
        runOnJS(onClose)();
      } else {
        panSharedValue.value = withSpring(0, {
          damping: 16,
          stiffness: 117,
        });
      }
    })
    .simultaneousWithExternalGesture(nativeGesture);

  const stylez = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: COLORS.white,
      padding: SPACING.md,
      borderBottomStartRadius: BORDER_RADIUS.md,
      borderBottomEndRadius: BORDER_RADIUS.md,
      transform: [{translateY: -panSharedValue.value}],
    };
  });

  const _gentlyClose = (idx: number) => {
    props.onSelect(idx, currentYearSelectedSharedValue.value);
    props.onClose();
  };
  return (
    <Portal>
      <Overlay>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={stylez}>
            <GestureDetector gesture={nativeGesture}>
              <Animated.ScrollView
                fadingEdgeLength={100}
                showsHorizontalScrollIndicator={false}
                ref={monthScrollRef}
                onLayout={() => {
                  monthScrollRef.current?.scrollTo({
                    x:
                      60 *
                        (years.findIndex(
                          a => a === currentYearSelectedSharedValue.value,
                        ) ?? currentYear) +
                      SPACING.md,
                    animated: true,
                  });
                }}
                horizontal
                contentContainerStyle={{
                  padding: SPACING.md,
                  gap: SPACING.md,
                }}>
                {years.map((year, i) => (
                  <YearPicker
                    key={year}
                    index={i}
                    year={year}
                    yearSharedValue={currentYearSelectedSharedValue}
                  />
                ))}
              </Animated.ScrollView>
            </GestureDetector>

            <View style={styles.monthContainer}>
              {DateHelper.getMonths().map((month, idx) => (
                <Pressable
                  key={idx.toString()}
                  animated
                  onPress={() => {
                    setSelectedMonthIndex(idx);
                    panSharedValue.value = withTiming(
                      _height,
                      {
                        duration: 100,
                      },
                      () => {
                        'worklet';
                        runOnJS(_gentlyClose)(idx);
                      },
                    );
                  }}
                  style={[
                    // eslint-disable-next-line react-native/no-inline-styles
                    {
                      backgroundColor:
                        selectedMonthIndex === idx ? COLORS.primary : '#F2F2EC',
                    },
                    styles.month,
                  ]}>
                  <Text
                    style={{
                      color:
                        selectedMonthIndex === idx
                          ? COLORS.white
                          : COLORS.mediumGray,
                    }}
                    textType="normal">
                    {month}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        </GestureDetector>
      </Overlay>
    </Portal>
  );
}

const styles = StyleSheet.create({
  month: {
    height: 48,
    minWidth: 48,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  monthContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    columnGap: 20,
    justifyContent: 'center',
    rowGap: 10,
  },
});
export default MonthYearPicker;
