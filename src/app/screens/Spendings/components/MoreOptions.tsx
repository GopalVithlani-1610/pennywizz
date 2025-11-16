import BhIcon from '@/src/app/assets';
import {
  Overlay,
  Portal,
  Pressable,
  Text,
  useToastContext,
} from '@/src/app/components';
import {categoriesState} from '@/src/app/state';
import CommonStyles from '@/src/app/styles';
import {BORDER_RADIUS, COLORS, SPACING} from '@/src/app/theme';
import {categoryDatabaseInstance} from '@/src/database';
import React from 'react';
import {View, StyleSheet, TouchableNativeFeedback} from 'react-native';
import Animated, {SlideInDown, SlideOutDown} from 'react-native-reanimated';
import {useRecoilState, useSetRecoilState} from 'recoil';
import {itemLongPressedAtom} from '../utils';

export default () => {
  const toast = useToastContext();
  const setCategoriesGlobalState = useSetRecoilState(categoriesState);
  const [itemLongPressed, setItemLongPressed] =
    useRecoilState(itemLongPressedAtom);

  if (itemLongPressed == null) {
    return null;
  }
  return (
    <Overlay>
      <TouchableNativeFeedback onPress={() => setItemLongPressed(null)}>
        <Portal>
          <Animated.View
            entering={SlideInDown}
            exiting={SlideOutDown}
            style={styles.moreOptionsContainer}>
            <View style={[CommonStyles.displayRow, styles.moreOptionsHeader]}>
              <Text textType="normal" style={{fontSize: 18}}>
                More Options for:{' '}
                <Text textType="subheading">{itemLongPressed.name}</Text>
              </Text>
              <Pressable
                animated={false}
                style={styles.crossBtn}
                onPress={() => setItemLongPressed(null)}>
                <BhIcon name="cross" />
              </Pressable>
            </View>

            <Pressable
              onPress={async () => {
                await categoryDatabaseInstance().pinCategory(
                  itemLongPressed.id,
                  !itemLongPressed.isPinned,
                );
                setCategoriesGlobalState(categories =>
                  categories.map(category => {
                    if (category.id === itemLongPressed.id) {
                      const isPinned = itemLongPressed.isPinned;
                      const newReference = Object.assign({}, category);
                      newReference.isPinned = !isPinned;
                      return newReference;
                    }
                    return category;
                  }),
                );
                toast.show(
                  (itemLongPressed.isPinned ? 'Unpinned' : 'Pinned') +
                    ' Category : ' +
                    itemLongPressed.name,
                  'Success',
                );
                setItemLongPressed(null);
              }}
              style={{
                paddingVertical: SPACING.md,
                backgroundColor: COLORS.lightGray,
                borderRadius: BORDER_RADIUS.sm,
                paddingHorizontal: SPACING.md,
              }}>
              <Text>
                📌 {itemLongPressed.isPinned ? 'Unstar' : 'Star'} category on
                dashboard
              </Text>
            </Pressable>
          </Animated.View>
        </Portal>
      </TouchableNativeFeedback>
    </Overlay>
  );
};

const styles = StyleSheet.create({
  moreOptionsContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    position: 'absolute',
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    padding: SPACING.big,
  },
  moreOptionsHeader: {
    justifyContent: 'space-between',
    marginBottom: SPACING.big,
  },
  crossBtn: {
    backgroundColor: '#FAFAFA',
    padding: SPACING.custom(1.5),
    borderRadius: BORDER_RADIUS.full,
  },
});
