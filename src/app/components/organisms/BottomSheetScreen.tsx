import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  PropsWithChildren,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {Pressable, Text} from '../atoms';
import {Portal} from '../portal';
import {SPACING} from '@/app/theme';
import {View} from 'react-native';
import {Overlay} from '../atoms';
import {BackHandler} from 'react-native';
import Common from '../../screens/TransactionEditor/components/SubScreens/Common';

type Props = PropsWithChildren & {
  headerTitle: string;
  component: React.ReactNode;
  beforeScreenOpen?: () => void;
};

export type BottomSheetScreenRef = {
  toggleBottomSheetScreen: () => void;
};

export default forwardRef<BottomSheetScreenRef, Props>((props, ref) => {
  const bottomsheetRef = useRef<BottomSheet>(null);
  const [openBottomSheet, setOpenBottomSheet] = React.useState(false);
  const [bottomSheetContentHeight, setBottomSheetContentHeight] =
    React.useState(260);
  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...backdropProps}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  useImperativeHandle(
    ref,
    () => {
      return {
        toggleBottomSheetScreen: () => setOpenBottomSheet(!openBottomSheet),
      };
    },
    [openBottomSheet],
  );

  useEffect(() => {
    const bhandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (openBottomSheet) {
        bottomsheetRef.current?.close();
        setOpenBottomSheet(false);
        return true;
      }
      return false;
    });

    return () => bhandler.remove();
  }, [openBottomSheet]);

  const snapPoints = useMemo(
    () => [bottomSheetContentHeight + 50],
    [bottomSheetContentHeight],
  );

  const Cloned = useMemo(() => {
    return React.cloneElement(props.component as JSX.Element, {
      style: undefined,
    });
  }, [props.component]);
  return (
    <>
      <Pressable
        style={(props.component as JSX.Element).props.style}
        onPress={() => {
          props.beforeScreenOpen?.();
          setOpenBottomSheet(a => !a);
        }}>
        <View pointerEvents="none">{Cloned}</View>
      </Pressable>
      {openBottomSheet && (
        <Portal>
          <Overlay>
            <BottomSheet
              ref={bottomsheetRef}
              // contentHeight={bottomSheetContentHeight + 100}
              backdropComponent={renderBackdrop}
              onClose={() => setOpenBottomSheet(false)}
              enablePanDownToClose
              style={{paddingHorizontal: SPACING.md}}
              snapPoints={snapPoints}>
              <View
                onLayout={e =>
                  setBottomSheetContentHeight(e.nativeEvent.layout.height)
                }>
                <Text
                  textType="subheading"
                  style={{marginVertical: SPACING.big, fontSize: 20}}>
                  {props.headerTitle}
                </Text>
                {props.children}
              </View>
            </BottomSheet>
          </Overlay>
        </Portal>
      )}
    </>
  );
});
