import 'react-native-gesture-handler';
import React, {Suspense, useEffect, useRef} from 'react';
import {PlatformColor, SafeAreaView} from 'react-native';
import {RecoilRoot} from 'recoil';
import {withCodePush} from './src/app/hof';
import NavigationRoot from './src/app/navigation';
import CommonStyles from './src/app/styles';
import {SPACING} from './src/app/theme';
import {
  Loader,
  PaymentProvider,
  PortalProvider,
  Text,
  ToastProvider,
} from './src/app/components';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {ErrorBoundary} from '@sentry/react-native';
import {View} from 'react-native';
import {
  NavigationContainer,
  useNavigationContainerRef,
  useTheme,
} from '@react-navigation/native';
import AnalyticsManager from './src/app/services/AnalyticsManager';
import CodePush from 'react-native-code-push';

function ErrorFallback() {
  useEffect(() => {
    AnalyticsManager.remoteLog('Fatal Error Occurred');
    setTimeout(() => {
      CodePush.restartApp();
    }, 0);
  }, []);
  return (
    <View style={[CommonStyles.center, {marginHorizontal: SPACING.big}]}>
      <Text
        textType="paragraph"
        style={{
          textAlign: 'center',
          color: PlatformColor('@android:color/holo_red_dark'),
        }}>
        Something not worked with between you and us.😕
      </Text>
    </View>
  );
}

const CodePushedApp = withCodePush(() => {
  const theme = useTheme();
  const navigationRef = useNavigationContainerRef();
  const routeNameRef = useRef<string>();
  return (
    <SafeAreaView style={CommonStyles.flex1}>
      <ErrorBoundary fallback={<ErrorFallback />}>
        <GestureHandlerRootView>
          <NavigationContainer
            theme={theme}
            ref={navigationRef}
            onReady={() => {
              routeNameRef.current = navigationRef.getCurrentRoute()?.name;
            }}
            onStateChange={() => {
              const previousRouteName = routeNameRef.current;
              const currentRouteName = navigationRef.getCurrentRoute()?.name;
              if (previousRouteName !== currentRouteName) {
                routeNameRef.current = currentRouteName;
                AnalyticsManager.remoteLog('Screen Visited', {
                  name: currentRouteName!,
                });
              }
            }}>
            <PaymentProvider>
              <ToastProvider>
                <RecoilRoot>
                  <PortalProvider>
                    <Suspense fallback={<Loader show />}>
                      <NavigationRoot />
                    </Suspense>
                  </PortalProvider>
                </RecoilRoot>
              </ToastProvider>
            </PaymentProvider>
          </NavigationContainer>
        </GestureHandlerRootView>
      </ErrorBoundary>
    </SafeAreaView>
  );
});

export default CodePushedApp;
