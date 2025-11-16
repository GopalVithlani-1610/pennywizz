import {StackScreenProps} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet, ScrollView, Linking} from 'react-native';
import {useSetRecoilState} from 'recoil';
import {
  PressableIconButton,
  FullScreenModal,
  Text,
  Screen,
} from '@/app/components';
import {NativeModule} from '@/app/helper';
import Utils from '@/app/utils';
import {
  SettingSection,
  ResetDatabase,
  CurrencyList,
  CategoryList,
  InDevelopment,
  PayeeList,
  ThemeSelector,
} from './components';
import {currencyState} from '@/app/state';
import {CurrencyOperations} from '@/src/database';
import {NavigationTypes, UtilTypes} from '@/src/types';
import {Data} from '@/app/assets';
import {useFocusEffect} from '@react-navigation/native';
import {AppUrl} from '@/app/config';
import BhIcon from '@/src/app/assets/icons';
import {BORDER_RADIUS, COLORS, FONTS, SPACING} from '@/src/app/theme';
import AnalyticsManager from '@/src/app/services/AnalyticsManager';
import {useTheme} from '@/app/hooks/useTheme';

const openAnotherApp = async (url: string) => {
  try {
    await Linking.openURL(url);
  } catch (err: any) {
    Utils.makeToast('No app found for this action');
  }
};

const ChevronRightIcon = ({color}: {color?: string}) => {
  const {colors} = useTheme();
  return <BhIcon name="chevron-right" color={color || colors.icon} />;
};
const ExternalLinkIcon = () => {
  const {colors} = useTheme();
  return <BhIcon name="external-link" color={colors.icon} />;
};

type ModalTextType =
  | 'Currency'
  | 'Categories'
  | 'Reset Database'
  | 'Features In Development'
  | 'Payee'
  | 'Theme'
  | null;
type Props = StackScreenProps<
  NavigationTypes.TSettingStackScreen,
  'Settings$$'
>;
export default ({navigation, route}: Props) => {
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const fullScreenRef = React.useRef<UtilTypes.TFullScreenModalRef>(null);
  const [openFullScreenModal, setOpenFullScreenModal] = React.useState(false);
  const [appVersion, setAppVerion] = React.useState<string | null>(null);
  const [selectModalText, setSelectModalText] =
    React.useState<ModalTextType>(null);
  const setCurrency = useSetRecoilState(currencyState);

  const sendMail = async () => {
    const deviceId = await AnalyticsManager.getOrCreateUserId();
    const body = `Identifier : ${deviceId}

---- DO NOT DELETE THE UPPER LINE AS IT IS A UNIQUE IDENTIFIER for you----

`;
    openAnotherApp(
      `mailto:Two.devlopers04@gmail.com?body=${body}&subject=Feedback/Suggestion`,
    );
  };

  const shareViaWhatsapp = () => {
    openAnotherApp(
      `whatsapp://send?text=Found Awesome app on play store for storing your finance bills\n\n${AppUrl}`,
    );
  };

  const toggleFullScreenModal = (typeOfScreen?: ModalTextType) => {
    if (typeOfScreen) {
      setOpenFullScreenModal(true);
      setSelectModalText(typeOfScreen);
      // navigation.setOptions({
      //   headerShown: false,
      // });
    } else {
      // navigation.setOptions({
      //   headerShown: true,
      //   //  headerMode: 'float',
      // });
      setTimeout(() => {
        setSelectModalText(null);
        setOpenFullScreenModal(false);
      }, 0);
    }
  };

  const openLicenses = () => {
    openAnotherApp(
      'https://nurtured-topic-071081.framer.app/articles/privacypolicy',
    );
  };

  const onCurrencySelectCallback = async (name: string, symbol: string) => {
    await CurrencyOperations.setCurrency(name, symbol);
    //setOpenFullScreenModal(false);
    Utils.vibrate();
    setCurrency(symbol);
  };

  React.useEffect(() => {
    // getDataFromRecoil();
    NativeModule.getAppVersion((version: string) => {
      setAppVerion(version);
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      let timeoutCancellable: NodeJS.Timeout;
      if (route.params && route.params.open) {
        timeoutCancellable = setTimeout(() => {
          toggleFullScreenModal(route.params!.open);
          //@ts-ignore hack for the scenario where route.params contain value and then navigate to the screen from bottom tab it remembers the route params.
          route.params = undefined;
        }, 350); //350 milliseconds for the delaying the transitions.
      }

      return () => timeoutCancellable && clearTimeout(timeoutCancellable);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route.params]),
  );
  const closeModal = () => {
    if (fullScreenRef.current) {
      fullScreenRef.current.close(toggleFullScreenModal);
    }
  };

  return (
    <Screen>
      <ScrollView>
        <SettingSection title="App settings">
          <>
            <PressableIconButton
              iconStyle={styles.iconStyle}
              style={styles.settingsViewStyle}
              onPress={() => toggleFullScreenModal('Currency')}
              iconName="currency"
              text="Currency"
              headerRight={<ChevronRightIcon />}
            />
            <PressableIconButton
              iconStyle={styles.iconStyle}
              style={styles.settingsViewStyle}
              onPress={() => toggleFullScreenModal('Categories')}
              iconName="circleWithPlus"
              text="Categories"
              headerRight={<ChevronRightIcon />}
            />
            <PressableIconButton
              iconStyle={styles.iconStyle}
              style={styles.settingsViewStyle}
              onPress={() => toggleFullScreenModal('Payee')}
              iconName="user"
              text="Payee"
              headerRight={<ChevronRightIcon />}
            />
            <PressableIconButton
              iconStyle={styles.iconStyle}
              style={styles.settingsViewStyle}
              onPress={() => toggleFullScreenModal('Theme')}
              iconName="settings"
              text="Theme"
              headerRight={<ChevronRightIcon />}
            />
          </>
        </SettingSection>
        <SettingSection title="Other settings">
          <>
            <PressableIconButton
              iconStyle={styles.iconStyle}
              style={styles.settingsViewStyle}
              onPress={() => toggleFullScreenModal('Reset Database')}
              iconName="oct-cross"
              text="Reset Database"
              headerRight={<ChevronRightIcon />}
            />
            {/* <PressableIconButton
              iconStyle={styles.iconStyle}
              onPress={restorePurchase}
              style={styles.settingsViewStyle}
              iconName="lock"
              text="Restore Purchase"
            /> */}
            <PressableIconButton
              onPress={sendMail}
              iconStyle={styles.iconStyle}
              iconName="mail"
              style={styles.settingsViewStyle}
              text="Suggest a new feature / feedback"
              headerRight={<ExternalLinkIcon />}
            />
            <PressableIconButton
              onPress={shareViaWhatsapp}
              iconName="share"
              iconStyle={styles.iconStyle}
              style={styles.settingsViewStyle}
              text="Share app with other"
            />
            <PressableIconButton
              onPress={openLicenses}
              iconStyle={styles.iconStyle}
              iconName="gavel"
              style={styles.settingsViewStyle}
              text="Privacy Policy"
              headerRight={<ExternalLinkIcon />}
            />
          </>
        </SettingSection>

        {appVersion != null && (
          <Text textType="subheading" style={styles.appVersionText}>
            {'\t'}Made for ❤️ly people {'\n'}{' '}
            {/* <Text style={[styles.appVersionText, {color: COLORS.darkPrimary}]}>
              By Infamous Developers{' '}
            </Text> */}
            App Version: v{appVersion}
          </Text>
        )}
      </ScrollView>

      {openFullScreenModal && (
        <FullScreenModal
          ref={fullScreenRef}
          title={
            selectModalText === 'Features In Development'
              ? 'Features In making ☕️'
              : selectModalText!
          }
          onModalClose={closeModal}>
          {selectModalText === 'Categories' ? (
            <CategoryList closeModal={closeModal} navigation={navigation} />
          ) : selectModalText === 'Reset Database' ? (
            <ResetDatabase />
          ) : selectModalText === 'Features In Development' ? (
            <InDevelopment />
          ) : selectModalText === 'Payee' ? (
            <PayeeList />
          ) : selectModalText === 'Theme' ? (
            <ThemeSelector />
          ) : (
            <CurrencyList
              onItemSelect={onCurrencySelectCallback}
              navigation={navigation}
              data={Data.Currency}
            />
          )}
        </FullScreenModal>
      )}
    </Screen>
  );
};

const getStyles = (colors: any) => {
  const baseStyles = StyleSheet.create({
    appVersionText: {
      fontSize: 12,
      textAlign: 'center',
      fontWeight: '400',
      marginTop: SPACING.big,
      color: colors.text.content,
    },
    settingsViewStyle: {
      paddingVertical: SPACING.sm + 4,
      borderBottomWidth: 0.6,
      borderColor: colors.border,
      borderRadius: BORDER_RADIUS.sm,
      paddingHorizontal: SPACING.sm,
    },
  });
  
  return {
    ...baseStyles,
    iconStyle: {size: 16, color: colors.primary},
  };
};
