import {Currency} from '@/src/app/assets/data';
import {captureException} from '@sentry/react-native';
import BhIcon from '@/src/app/assets/icons';
import {
  BottomSheetComponent,
  Header,
  Pressable,
  Screen,
  Text,
  useToastContext,
} from '@/src/app/components';
import CommonStyles from '@/src/app/styles';
import {BORDER_RADIUS, COLORS, FONTS, SPACING} from '@/src/app/theme';
import {NavigationTypes} from '@/src/types';
import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import BottomSheet from '@gorhom/bottom-sheet';
import {
  CurrencyOperations,
  accountDatabaseInstance,
  accountTypeDatabaseInstance,
} from '@/src/database';
import {DateHelper} from '@/src/app/helper';
import {AccountWriteEntity} from '@/src/types/domainTypes';
import AnalyticsManager, {
  AnalyticsEventKeys,
} from '@/src/app/services/AnalyticsManager';
import {AmountInputRef, AmountInputSection} from './AmountInputRef';
import {useSetRecoilState} from 'recoil';
import {currencyState} from '@/src/app/state';

type InputSelectionProps = {
  selection: string;
};

const InputSelection = (props: InputSelectionProps) => {
  return (
    <View style={styles.currencySelectedContainer}>
      <Text>{props.selection}</Text>
      <BhIcon name="chevronDown" />
    </View>
  );
};

type Props = StackScreenProps<
  NavigationTypes.TOnboardingStackScreen,
  'AmountInsertion'
>;

export default (props: Props) => {
  const sharedValue = useSharedValue(0);
  const [showAccountInputs, setShowAccountInputs] = React.useState(false);
  const [selectedCurrency, setSelectedCurrency] = React.useState(Currency[0]);
  const setCurrencyRecoilValue = useSetRecoilState(currencyState);
  const currencyBottomSheetRef = React.useRef<BottomSheet>(null);
  const cashAmountInputRef = React.useRef<AmountInputRef>(null);
  const cardAmountInputRef = React.useRef<AmountInputRef>(null);
  const toast = useToastContext();
  useEffect(() => {
    AnalyticsManager.remoteLog(AnalyticsEventKeys.OnboardingJourney);
    accountTypeDatabaseInstance().createCommonAccountType();
  }, []);
  const style = useAnimatedStyle(() => {
    return {
      fontSize: interpolate(
        sharedValue.value,
        [0, 0.5, 1],
        [40, 27, 14],
        Extrapolation.CLAMP,
      ),
      width: '80%',
      marginBottom: SPACING.md,
      fontFamily: FONTS.bold,
      // fontFamily: 'InterVariable',
    };
  });

  const containerStyle = useAnimatedStyle(() => {
    return {
      flex: 0.8,
      justifyContent: 'center',
      transform: [
        {
          translateY: withSpring(
            interpolate(
              sharedValue.value,
              [0, 0.5, 1],
              [250, 100, 0],
              Extrapolation.CLAMP,
            ),
            {
              duration: 100,
            },
          ),
        },
      ],
    };
  });
  const renderCurrencyItem = React.useCallback(
    (item: (typeof Currency)[0]) => {
      return (
        <Pressable
          animated={false}
          onPress={() => {
            currencyBottomSheetRef.current?.close();
            setShowAccountInputs(true);
            setSelectedCurrency(item);
            setCurrencyRecoilValue(item.symbol);
            sharedValue.value = withTiming(1);
          }}
          style={styles.currencyItemContainer}>
          <Text>{item.name}</Text>
          <Text>{item.symbol}</Text>
        </Pressable>
      );
    },
    [sharedValue],
  );

  const onContinuePress = async () => {
    if (!showAccountInputs) {
      currencyBottomSheetRef.current?.close();
      setShowAccountInputs(true);
      setCurrencyRecoilValue(Currency[0].symbol);
      sharedValue.value = withTiming(1);
      return;
    }
    try {
      await CurrencyOperations.setCurrency(
        selectedCurrency.name,
        selectedCurrency.symbol,
      );
      const models: AccountWriteEntity[] = [];
      models.push({
        amount: Number(cardAmountInputRef.current!.getAmount()),
        name: 'Card',
      });
      models.push({
        amount: Number(cashAmountInputRef.current!.getAmount()),
        name: 'Cash',
      });
      const allAccounts = await accountDatabaseInstance().getAllAccounts(); // for back and then continue.
      if (allAccounts.length === 0) {
        await accountDatabaseInstance().createAccount(models);
      }
      // save in accounts
      props.navigation.navigate('CategorySelection');
    } catch (e) {
      captureException(e, {data: 'Onboarding::OnContinuePressed'});
      toast.show('Something went wrong here.Please try again', 'Error');
    }
  };
  return (
    <Screen.Onboarding>
      <Header headerTitle="Spendsure" />

      <View style={{flex: 1, justifyContent: 'center'}}>
        <Animated.Text style={style}>Select{'\n'}Currency</Animated.Text>
        <Text textType="normal" style={styles.currencySubheadingText}>
          currency in which you will create transactions bill
        </Text>
        <BottomSheetComponent
          ref={currencyBottomSheetRef}
          sheetData={Currency}
          sheetRenderItem={renderCurrencyItem}>
          <InputSelection
            selection={`${selectedCurrency.symbol} ${selectedCurrency.name}`}
          />
        </BottomSheetComponent>

        {showAccountInputs && (
          <Animated.View style={containerStyle}>
            <Text textType="subheading" style={styles.balanceHeadingText}>
              your current balance in card or cash
            </Text>
            <View style={{gap: SPACING.md}}>
              <AmountInputSection ref={cardAmountInputRef} type="Card" />
              <AmountInputSection ref={cashAmountInputRef} type="Cash" />
            </View>
          </Animated.View>
        )}
      </View>
      <Pressable onPress={onContinuePress} style={CommonStyles.btnStyle}>
        <Text style={CommonStyles.btnTextStyle}>Continue</Text>
      </Pressable>
    </Screen.Onboarding>
  );
};

export const styles = StyleSheet.create({
  balanceHeadingText: {
    textAlign: 'center',
    marginBottom: SPACING.big,
    fontSize: 14,
    color: COLORS.subHeadingText,
    marginTop: SPACING.md,
  },
  currencyItemContainer: {
    padding: SPACING.md,
    ...CommonStyles.displayRow,
    justifyContent: 'space-between',
  },
  currencySubheadingText: {
    fontSize: 14,
    marginBottom: SPACING.md,
    color: COLORS.mediumGray,
  },
  currencySelectedContainer: {
    backgroundColor: COLORS.white,
    height: 48,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    ...CommonStyles.displayRow,
    ...CommonStyles.ctaShadow,
  },
});
