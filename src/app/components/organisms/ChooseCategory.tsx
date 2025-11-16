import React, {useCallback, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useRecoilValue} from 'recoil';
import {categoriesState} from '@/app/state';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import {Checkbox, Overlay, Text} from '../atoms';
import {Portal} from '../portal';
import {CategoryEntity} from '@/src/types/domainTypes';
import CommonStyles from '@/app/styles';
import {BORDER_RADIUS, COLORS, SPACING} from '@/app/theme';
import {PressableTextButton} from '../molecules';

type Props = {
  isMultiSelect?: boolean;
  show?: 'all' | 'expense' | 'income';
  onClose?: () => void;
  byDefaultSelectAll?: boolean;
  onDone: (categoryIds: string[]) => void;
  initialValue?: string[];
};
export default ({
  show = 'all',
  onClose,
  isMultiSelect,
  byDefaultSelectAll,
  onDone,
  initialValue,
}: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const categories = useRecoilValue(categoriesState).filter(a => {
    return show === 'all' || a.type === show;
  });

  const _currencyInitialSelected = categories.filter(a =>
    initialValue && initialValue.length > 0
      ? initialValue.indexOf(a.id) > -1
      : true,
  );
  const [selectedMultiCategory, setSelectedMultiCategory] = useState<
    {isChecked: boolean; id: string}[]
  >(
    _currencyInitialSelected.map(c => ({
      id: c.id,
      isChecked: byDefaultSelectAll ?? false,
    })),
  );

  const onCheckboxChange = useCallback(
    (e: boolean, item: CategoryEntity) => {
      const category = selectedMultiCategory.filter(a => a.id === item.id)[0];
      if (!category) {
        return;
      }
      category.isChecked = e;
      setSelectedMultiCategory([...selectedMultiCategory]);
    },
    [selectedMultiCategory],
  );

  const renderItem = ({item}: {item: CategoryEntity}) => {
    return (
      <View style={[CommonStyles.displayRow, styles.itemContainer]}>
        <View style={[CommonStyles.displayRow, {gap: SPACING.sm, flex: 1}]}>
          <Text style={styles.emoji}>{item.emoji}</Text>
          <Text style={{fontSize: 14, flex: 1}}>{item.name}</Text>
        </View>

        {isMultiSelect && (
          <Checkbox
            value={selectedMultiCategory.find(a => a.id === item.id)?.isChecked}
            onChange={e => onCheckboxChange(e, item)}
          />
        )}
      </View>
    );
  };

  return (
    <Overlay>
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={['55%']}
          enablePanDownToClose
          onClose={onClose}>
          {isMultiSelect && (
            <View style={[CommonStyles.displayRow, styles.actionBtnContainer]}>
              <PressableTextButton
                onPress={() => {
                  setSelectedMultiCategory(
                    selectedMultiCategory.map(i => ({...i, isChecked: false})),
                  );
                }}
                text="Clear All"
                textStyle={{color: COLORS.red, alignSelf: 'flex-end'}}
              />
              <PressableTextButton
                onPress={() => {
                  onDone(
                    selectedMultiCategory
                      .filter(a => a.isChecked)
                      .map(a => a.id),
                  );
                  bottomSheetRef.current?.close();
                }}
                text="Done"
                textStyle={{color: COLORS.darkPrimary, alignSelf: 'flex-end'}}
              />
            </View>
          )}
          <BottomSheetFlatList
            contentContainerStyle={{gap: SPACING.sm}}
            data={categories}
            renderItem={renderItem}
            ItemSeparatorComponent={<View style={CommonStyles.separator} />}
          />
        </BottomSheet>
      </Portal>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  emoji: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.categoryImgBackground,
    borderRadius: BORDER_RADIUS.full,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  itemContainer: {
    padding: SPACING.sm,
    paddingHorizontal: SPACING.big,
    justifyContent: 'space-between',
    flex: 1,
  },
  actionBtnContainer: {
    justifyContent: 'space-between',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
});
