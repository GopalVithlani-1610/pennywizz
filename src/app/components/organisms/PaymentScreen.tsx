import React, {
  createContext,
  forwardRef,
  PropsWithChildren,
  RefObject,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import BhIcon from '@/app/assets';
import {Loader, Pressable, Text} from '../atoms';
import {BORDER_RADIUS, COLORS, SPACING} from '@/app/theme';
import CommonStyles from '@/app/styles';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {PaymentManager} from '@/app/helper';
import {Product, SubscriptionPeriodUnit} from 'react-native-qonversion';
import {PressableTextButton} from '../molecules';

const features = [
  '🥳 Unlimited Categories',
  '🤑 Unlimited accounts',
  '🥺 Help the development team',
  '... access to many future features',
];

export type PaymentRefObject = {
  show: () => void;
};

const paymentContext = createContext<RefObject<PaymentRefObject> | null>(null);

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);
export const usePaymentContext = () => {
  const context = useContext(paymentContext);
  if (!context?.current) {
    throw new Error(
      'usePaymentContext should be called from the PaymentContext',
    );
  }
  return context.current;
};

export const PaymentProvider = (props: PropsWithChildren) => {
  const ref = useRef<PaymentRefObject>(null);
  // useAsyncEffect(async () => {
  //   const userSessions = await KeyValueStorage.getUserSessions();
  //   if (userSessions % 2 === 0) {
  //     // ref.current?.show(); // we are hoping that the ref will get assigned until the db call.

  //   }
  // });
  return (
    <paymentContext.Provider value={ref}>
      {props.children}
      <PaymentScreen ref={ref} />
    </paymentContext.Provider>
  );
};

const {height} = Dimensions.get('window');
const _config = {
  stiffness: 400,
  damping: 80,
};

type SubscriptionPackage = {
  price: string;
  type: string;
  trialPeriod: string; // 7 days.
  isDiscounted?: boolean;
  isBestValue?: boolean;
  id: string;
  _baseProduct: Product;
};
const PaymentScreen = forwardRef<PaymentRefObject>((_, ref) => {
  const [showScreen, setShowScreen] = useState(true);
  const [selectedPack, setSelectedPack] = useState<SubscriptionPackage | null>(
    null,
  );
  const [subscriptionPackageList, setSubscriptionPackageList] = useState<
    SubscriptionPackage[]
  >([]);
  const [showLoader, setShowLoader] = useState(false);
  const screenAnimatedSharedValue = useSharedValue(0);

  useImperativeHandle(
    ref,
    () => {
      return {
        show: () => {
          screenAnimatedSharedValue.value = withSpring(1, _config, () => {
            runOnJS(setShowScreen)(true);
          });
        },
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const _closeScreen = () => {
    screenAnimatedSharedValue.value = withSpring(0, _config, () => {
      runOnJS(setShowScreen)(false);
    });
  };

  useEffect(() => {
    PaymentManager.getOfferings().then(offering => {
      if (!offering) {
        return;
      }
      const subscriptionPackages = offering.map(offer => {
        return {
          id: offer.basePlanID,
          price: offer.prettyPrice!,
          trialPeriod: offer.trialPeriod
            ? `${offer.trialPeriod?.unitCount} ${offer.trialPeriod?.unit}`
            : undefined,
          type: `${offer.subscriptionPeriod!.unit}ly`,
          isBestValue:
            offer.subscriptionPeriod!.unit === SubscriptionPeriodUnit.YEAR, // since we are giving discounts.
          _baseProduct: offer,
        };
      }) as SubscriptionPackage[];
      setSelectedPack(subscriptionPackages[0]);
      setSubscriptionPackageList(subscriptionPackages);
    });
  }, []);

  const stylez = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            screenAnimatedSharedValue.value,
            [0, 1],
            [height, 0],
          ),
        },
      ],
    };
  });

  const _purchasePack = async () => {
    if (!selectedPack) {
      return;
    }
    await PaymentManager.makePayment(selectedPack._baseProduct);
  };

  const _restorePurchase = async () => {
    setShowLoader(true);
    await PaymentManager.restorePurchase();
    setShowLoader(false);
  };

  if (!showScreen) {
    return null;
  }
  return (
    <AnimatedImageBackground
      source={require('@/app/assets/images/background.png')}
      style={[styles.container, stylez]}>
      <Pressable onPress={_closeScreen}>
        <BhIcon name="cross" size={16} color={'#D3D3D3'} />
      </Pressable>
      <View style={styles.titleAndFeatureContainer}>
        <Text style={styles.headerText}>Try Budgethive for free</Text>
        <View style={styles.featureListContainer}>
          {features.map(feature => {
            return (
              <View
                key={feature}
                style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
                <BhIcon name="check" size={18} color={COLORS.greenReport} />
                <Text style={styles.featureText} key={feature}>
                  {feature}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        {subscriptionPackageList.length === 0 && (
          <View style={CommonStyles.center}>
            <ActivityIndicator size={'large'} color={COLORS.primary} />
            <Text style={{marginTop: SPACING.md}}>
              Loading best packages for you
            </Text>
          </View>
        )}
        {subscriptionPackageList.length > 0 &&
          subscriptionPackageList.map(subscription => {
            const isSelected = subscription.id === selectedPack?.id;
            return (
              <Pressable
                key={subscription.type}
                onPress={() => setSelectedPack(subscription)}
                style={[
                  {
                    borderColor: isSelected
                      ? COLORS.darkPrimary
                      : COLORS.lightPrimary,
                    borderBottomWidth: !isSelected ? 4 : 2,
                    borderBottomColor: isSelected
                      ? COLORS.darkPrimary
                      : COLORS.lightPrimary,
                  },
                  styles.packContainer,
                ]}>
                <View>
                  <View style={CommonStyles.displayRow}>
                    <Text style={{fontSize: 16, fontWeight: '500'}}>
                      {subscription.type}
                    </Text>
                    {subscription.isBestValue && (
                      <Text style={styles.bestValueText}>Best Value</Text>
                    )}
                  </View>

                  <Text style={{fontSize: 13, marginTop: 5, color: '#333333'}}>
                    First {subscription.trialPeriod} free · Then{' '}
                    <Text style={{fontWeight: 'semibold'}}>
                      {subscription.price}
                    </Text>
                  </Text>
                </View>

                <View
                  style={[
                    styles.radioContainer,
                    {
                      backgroundColor: isSelected
                        ? 'transparent'
                        : COLORS.slightOffWhite,
                      borderWidth: isSelected ? 2 : 0,
                      borderColor: isSelected
                        ? COLORS.darkPrimary
                        : COLORS.black,
                    },
                  ]}>
                  {isSelected && <View style={styles.selectedRadio} />}
                </View>
                {/* Add your button code here */}
              </Pressable>
            );
          })}
        <View style={{marginTop: SPACING.md}}>
          <Pressable
            onPress={_purchasePack}
            style={{
              backgroundColor: COLORS.primary,
              padding: SPACING.md,
              borderRadius: BORDER_RADIUS.sm,
            }}>
            <Text style={styles.subscribeBtn}>Try free & Subscribe</Text>
          </Pressable>
          <PressableTextButton
            text="Restore Purchase"
            textStyle={{textAlign: 'center', color: COLORS.mediumGray}}
            style={{padding: SPACING.md}}
            onPress={_restorePurchase}
          />
        </View>
      </View>
      {showLoader && <Loader show text=":) looooooding..." />}
    </AnimatedImageBackground>
  );
});

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: 'center',
    gap: 20,
    padding: 20,
    overflow: 'hidden',
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.lightPrimary,
  },
  subscribeBtn: {
    color: '#1c2226',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
  headerText: {
    fontSize: 38,
    fontWeight: 'bold',
  },
  radioContainer: {
    width: 20,
    height: 20,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadio: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: COLORS.darkPrimary,
  },
  featureListContainer: {
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
  },
  packContainer: {
    backgroundColor: COLORS.white,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: SPACING.md,
    borderWidth: 2,
    borderRadius: SPACING.md,
  },
  featureText: {
    fontSize: 17,
    letterSpacing: 0.2,
    fontWeight: '400',
    textAlign: 'center',
    color: COLORS.darkGray,
    // fontStyle: 'italic',
    // fontFamily: FONTS.medium,
  },
  titleAndFeatureContainer: {flex: 1, justifyContent: 'center', gap: 20},
  bestValueText: {
    backgroundColor: COLORS.secondry,
    color: COLORS.white,
    fontSize: 12,
    paddingHorizontal: 5,
    borderRadius: 2,
    marginLeft: 5,
  },
});

export default PaymentScreen;
