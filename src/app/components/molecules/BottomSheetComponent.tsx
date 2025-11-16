//

import React, {PropsWithChildren, Ref, useCallback, useEffect} from 'react';
import {View} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetFlatList,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {Pressable, Text} from '../atoms';
import {Portal} from '../portal';
import {FlatListProps} from 'react-native';
import {BackHandler} from 'react-native';
import CommonStyles from '../../styles';

type Props<T> = {
  children: React.JSX.Element;
  sheetData: T[];
  sheetRenderItem: (data: Props<T>['sheetData'][0]) => React.ReactElement;
  sheetTitle?: string;
};

const Component = <T,>(
  props: Props<T> & Partial<FlatListProps<T>>,
  ref: Ref<BottomSheet>,
) => {
  const [isBottomSheetVisible, setIsBottomSheetVisible] = React.useState(false);

  const renderItem = ({item}: {item: T}) => {
    return props.sheetRenderItem(item);
  };

  useEffect(() => {
    const bhandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isBottomSheetVisible) {
        // setIsBottomSheetVisible(false);
        try {
          //this seems to work.
          ref.current.close();
        } catch (e) {
          setIsBottomSheetVisible(false);
        }
        return true;
      }
      return false;
    });

    return () => bhandler.remove();
  }, [isBottomSheetVisible]);

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

  return (
    <>
      <Pressable
        animated={false}
        onPress={() => setIsBottomSheetVisible(e => !e)}>
        {props.children}
      </Pressable>
      {isBottomSheetVisible && (
        <Portal>
          <BottomSheet
            ref={ref}
            backdropComponent={renderBackdrop}
            onClose={() => setIsBottomSheetVisible(false)}
            enablePanDownToClose
            snapPoints={['60%']}>
            {props.sheetTitle && (
              <Text textType="subheading" style={CommonStyles.subheadingTitle}>
                {props.sheetTitle}
              </Text>
            )}
            <BottomSheetFlatList
              showsVerticalScrollIndicator
              {...props}
              data={props.sheetData}
              keyExtractor={(_, i) => i.toString()}
              renderItem={renderItem}
            />
          </BottomSheet>
        </Portal>
      )}
    </>
  );
};

type BottomSheetView<T> = PropsWithChildren & {
  component: React.ReactNode;
};

Component.Component = <T,>(
  props: BottomSheetView<T>,
  ref: Ref<BottomSheet>,
) => {
  const [isBottomSheetVisible, setIsBottomSheetVisible] = React.useState(false);
  return (
    <>
      <Pressable
        animated={false}
        onPress={() => setIsBottomSheetVisible(e => !e)}>
        <View pointerEvents="none">{props.component}</View>
      </Pressable>
      {isBottomSheetVisible && (
        <Portal>
          <BottomSheet
            ref={ref}
            backdropComponent={BottomSheetBackdrop}
            onClose={() => setIsBottomSheetVisible(false)}
            enablePanDownToClose
            snapPoints={['60%']}>
            <BottomSheetView>{props.children}</BottomSheetView>
          </BottomSheet>
        </Portal>
      )}
    </>
  );
};

export const BottomSheetComponentView = React.forwardRef(Component.Component);
export default React.forwardRef(Component) as <T>(
  props: Props<T> & Partial<FlatListProps<T>> & {ref?: Ref<BottomSheet>},
) => ReturnType<typeof Component>;
