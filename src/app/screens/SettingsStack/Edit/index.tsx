import {StackScreenProps} from '@react-navigation/stack';
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useSetRecoilState} from 'recoil';
import {NavigationTypes} from '@/src/types';
import {
  EmojiReader,
  Pressable,
  PressableTextButton,
  RadioButton,
  Screen,
  Text,
  TextInput,
  useToastContext,
} from '@/app/components';
import {categoriesState} from '@/app/state';
import CommonStyles from '@/app/styles';
import {BORDER_RADIUS, COLORS, FONTS, SPACING} from '@/app/theme';
import {categoryDatabaseInstance} from '@/src/database';
import {categoryTypeAsPerDb} from '@/src/database/utils';
import {captureException} from '@sentry/react-native';
import BhIcon from '@/src/app/assets';

type Props = StackScreenProps<NavigationTypes.TSettingStackScreen, 'Edit'>;
export default (props: Props) => {
  const toast = useToastContext();
  const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
  const [state, setState] = useState({
    name: props.route.params.category?.name ?? '',
    emoji: props.route.params.category?.emoji,
    type: props.route.params.category?.type,
  });
  const setAllCategories = useSetRecoilState(categoriesState);

  const saveOrEdit = async () => {
    try {
      if (!state.type) {
        return toast.show("Category type can't be kept empty", 'Error');
      }
      if (!state.name) {
        return toast.show("Category name can't be kept empty", 'Error');
      }
      if (!state.emoji) {
        return toast.show("Category emoji can't be kept empty", 'Error');
      }
      const name = state.name.trim();
      if (props.route.params.type === 'New') {
        await categoryDatabaseInstance().saveCategory({
          emoji: state.emoji,
          name: name,
          type: categoryTypeAsPerDb(state.type!),
        });

        setAllCategories(await categoryDatabaseInstance().getCategories());
        toast.show('Category created successfully.', 'Success');
      } else {
        await categoryDatabaseInstance().updateCategory({
          emoji: state.emoji,
          name: name,
          id: props.route.params.category!.id,
          isDeleted: false,
        });
        setAllCategories(categories => {
          return categories.map(c =>
            c.id === props.route.params.category!.id
              ? {
                  ...c,
                  emoji: state.emoji!,
                  name: name,
                }
              : c,
          );
        });
        toast.show('Category updated successfully.', 'Success');
      }
    } catch (e: any) {
      captureException(e, {data: {fn: 'saveOrEdit'}});
      toast.show(e.message, 'Error');
    }
  };

  const deleteCategory = async () => {
    try {
      if (!props.route.params.category || !props.route.params.category.id) {
        throw new Error('Category id not valid');
      }
      await categoryDatabaseInstance().deleteCategory(
        props.route.params.category.id,
      );
      setAllCategories(categories =>
        categories.filter(c => c.id !== props.route.params.category!.id),
      );
      toast.show('Category deleted successfully.', 'Success');
      props.navigation.goBack();
    } catch (e: any) {
      toast.show(e.message, 'Error');
    }
  };

  const onRadioButtonPress = (type: 'expense' | 'income') => {
    setState({...state, type});
  };

  return (
    <Screen>
      <Pressable
        onPress={() => {
          setIsEmojiPickerVisible(!isEmojiPickerVisible);
        }}
        style={styles.selectedEmojiContainer}>
        {state.emoji ? (
          <Text style={styles.emojiText} textType="subheading">
            {state.emoji}
          </Text>
        ) : (
          <Text textType="subheading">Pick a emoji</Text>
        )}
        <View style={styles.editIconContainer}>
          <BhIcon name="edit-pencil" size={20} color={COLORS.subHeadingText} />
        </View>
      </Pressable>
      {props.route.params.comingFrom === 'Category' &&
        typeof props.route.params.type !== 'undefined' &&
        props.route.params.type === 'New' && (
          <View style={styles.billTypeContainer}>
            <Text
              textType="heading"
              style={[{marginBottom: 10}, styles.billTypeText]}>
              Category Type
            </Text>

            {!props.route.params.category?.id && (
              <View style={[CommonStyles.displayRow, {gap: SPACING.md}]}>
                <RadioButton
                  onPress={onRadioButtonPress}
                  selected={state.type === 'expense'}
                  text="expense"
                />
                <RadioButton
                  onPress={onRadioButtonPress}
                  selected={state.type === 'income'}
                  text="income"
                />
              </View>
            )}
          </View>
        )}
      <View style={{marginTop: SPACING.big}}>
        <TextInput
          placeholder={'category name'}
          // maxLength={40}
          style={styles.textInput}
          value={state.name}
          onChangeText={e => setState({...state, name: e})}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Pressable onPress={saveOrEdit} style={CommonStyles.btnStyle}>
          <Text style={{fontSize: 16, color: COLORS.white}}>Save</Text>
        </Pressable>
        {props.route.params.category !== undefined &&
          props.route.params.category.id && (
            <PressableTextButton
              textType="subheading"
              textStyle={{color: COLORS.red, fontSize: 14}}
              text="Delete"
              onPress={deleteCategory}
              style={[CommonStyles.btnStyle, styles.deleteButton]}
            />
          )}
      </View>
      {isEmojiPickerVisible && (
        <EmojiReader
          onClose={() => setIsEmojiPickerVisible(false)}
          onEmojiSelect={(emoji: string) => {
            setState({...state, emoji});
          }}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  textInput: {
    padding: SPACING.md,
    // marginHorizontal: 10,
    backgroundColor: COLORS.white,
    fontSize: 16,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: 10,
    color: '#000',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.lightPrimary,
    textAlign: 'center',
    fontFamily: FONTS.semiBold,
  },
  buttonContainer: {
    marginTop: SPACING.big,
    gap: SPACING.sm,
  },
  deleteButton: {
    // padding: SPACING.sm,
    elevation: 0,
    backgroundColor: 'transparent',
  },
  billTypeContainer: {
    // marginHorizontal: 10,
    marginVertical: 8,
  },
  billTypeText: {
    color: '#000',
    fontSize: 14,
  },
  selectedEmojiContainer: {
    backgroundColor: COLORS.lightGray,
    width: 150,
    height: 150,
    borderRadius: 150 / 4,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: SPACING.big,
    borderWidth: 3,
    borderColor: COLORS.categoryImgBackground,
  },
  emojiText: {
    fontSize: 70,
    textShadowColor: COLORS.subHeadingText,
    textShadowOffset: {width: 4, height: 2},
    textShadowRadius: 3,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: -8,
    right: -10,
    backgroundColor: COLORS.white,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
