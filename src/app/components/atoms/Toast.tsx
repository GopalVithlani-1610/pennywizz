import React, {
  PropsWithChildren,
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {BORDER_RADIUS, COLORS, SPACING} from '@/app/theme';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import Text from './Text';

type ConfigValue = {
  background: string;
  textColor: string;
};
const Config: Record<Props['type'], ConfigValue> = {
  Error: {
    background: COLORS.red,
    textColor: COLORS.white,
  },
  Success: {
    background: '#3366FF',
    textColor: COLORS.white,
  },
  Unique: {
    background: COLORS.lightGreen,
    textColor: COLORS.black,
  },
  Fatal: {
    background: COLORS.lightGray,
    textColor: COLORS.red,
  },
};

type Props = {
  type: 'Error' | 'Success' | 'Unique' | 'Fatal';
};
type ToastRefType = {
  show: (s: string, type: Props['type']) => void;
};
const TOAST_DURATION = 2000;
const ANIMATED_CONFIG = {
  mass: 0.5,
  damping: 5,
  stiffness: 100,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 2,
};
let config = Config.Success;

const Toast = forwardRef<ToastRefType, {}>((_, ref) => {
  const sharedValue = useSharedValue(0);
  const [showToast, setShowToast] = useState('');
  const callback = useCallback(() => {
    setTimeout(() => {
      sharedValue.value = withSpring(0, ANIMATED_CONFIG, () => {
        runOnJS(setShowToast)('');
      });
    }, TOAST_DURATION);
  }, [sharedValue]);
  useImperativeHandle(
    ref,
    () => {
      return {
        show: (d: string, type: Props['type']) => {
          config = Config[type];
          if (type === 'Fatal') {
            d = '⚠️Non Recoverable: ' + d;
          }
          sharedValue.value = withSpring(1, ANIMATED_CONFIG, () => {
            if (type !== 'Fatal') {
              runOnJS(callback)();
            }
          });
          setShowToast(d);
        },
      };
    },
    [callback, sharedValue],
  );
  const style = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        sharedValue.value,
        [0, 1],
        [0, 1],
        Extrapolation.CLAMP,
      ),
      backgroundColor: config.background,
      margin: SPACING.md,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10000,
      padding: SPACING.md,
      borderRadius: BORDER_RADIUS.sm,
      transform: [
        {
          scale: interpolate(
            sharedValue.value,
            [0, 0.9, 1],
            [0.2, 1, 0.995],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  if (showToast.length === 0) {
    return null;
  }

  return (
    <Animated.View style={style}>
      <Text textType="subheading" style={{color: config.textColor}}>
        {showToast}
      </Text>
    </Animated.View>
  );
});

const ToastContext = createContext<React.RefObject<ToastRefType> | null>(null);

export const useToastContext = () => {
  const toastContext = useContext(ToastContext);
  if (!toastContext || toastContext === null) {
    throw new Error(
      'Toast Context should be called inside of context or calling it too early...',
    );
  }

  return toastContext.current!;
};

export const ToastProvider = ({children}: PropsWithChildren) => {
  const value = useRef<ToastRefType>(null);
  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast ref={value} />
    </ToastContext.Provider>
  );
};
export default Toast;
