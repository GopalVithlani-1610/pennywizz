import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Text, StyleSheet, ScrollView, FlatList, Dimensions} from 'react-native';
import emojis from '@/app/assets/emoji.json';
import {BORDER_RADIUS, COLORS, SPACING} from '../../theme';
import {FullScreenModal} from '../molecules';
import {
  atom,
  useRecoilValue,
  useResetRecoilState,
  useSetRecoilState,
} from 'recoil';
import Pressable from './Pressable';
import {SearchBar} from '../../screens/Spendings/components';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Screen from './Screen';
import {Portal} from '../portal';
import {UtilTypes} from '@/src/types';

type EmojiType = (typeof emojis)[0];
const _emojiSize = 60;

export const Categories = {
  emotion: {
    symbol: '😀',
    name: 'Smileys & Emotion',
  },
  people: {
    symbol: '🧑',
    name: 'People & Body',
  },
  nature: {
    symbol: '🦄',
    name: 'Animals & Nature',
  },
  food: {
    symbol: '🍔',
    name: 'Food & Drink',
  },
  activities: {
    symbol: '⚾️',
    name: 'Activities',
  },
  history: {
    symbol: '🕘',
    name: 'Recently used',
  },
  places: {
    symbol: '✈️',
    name: 'Travel & Places',
  },
  objects: {
    symbol: '💡',
    name: 'Objects',
  },
  symbols: {
    symbol: '🔣',
    name: 'Symbols',
  },
  flags: {
    symbol: '🏳️‍🌈',
    name: 'Flags',
  },
};

const contentHeaderSyncAtom = atom({
  key: 'contentHeaderSyncAtom',
  default: 'emotion',
});
const searchedAtom = atom({
  key: 'searchedAtom',
  default: '',
});
const Header = () => {
  const setContentHeaderSyncAtom = useSetRecoilState(contentHeaderSyncAtom);
  const tabIndicatorSharedValue = useSharedValue(0);
  const categoriesKeys = Object.keys(Categories);

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            tabIndicatorSharedValue.value,
            categoriesKeys.map((_, i) => i),
            categoriesKeys.map((_, i) => i * (SPACING.md + 50)),
            Extrapolation.CLAMP,
          ),
        },
      ],
      width: 30,
      height: 2,
      backgroundColor: COLORS.secondry,
      position: 'absolute',
      borderRadius: BORDER_RADIUS.full,
      bottom: 0,
      marginHorizontal: 3,
    };
  }, []);
  return (
    <ScrollView
      horizontal
      fadingEdgeLength={20}
      contentContainerStyle={{gap: SPACING.md}}
      style={{height: 60, marginBottom: SPACING.big, flexGrow: 0}}>
      {categoriesKeys.map((categoryGroup, idx) => {
        return (
          <Pressable
            animated={false}
            key={categoryGroup}
            style={{width: 50}}
            onPress={() => {
              tabIndicatorSharedValue.value = withTiming(idx);
              setContentHeaderSyncAtom(categoryGroup);
            }}>
            <Text style={{fontSize: 30}}>
              {Categories[categoryGroup as keyof typeof Categories].symbol}
            </Text>
          </Pressable>
        );
      })}
      <Animated.View style={style} />
    </ScrollView>
  );
};

const _horizontalPadding = SPACING.md * 2;

const NO_OF_COLUMNS = Math.round(
  (Dimensions.get('window').width - _horizontalPadding) / _emojiSize,
);

const Content = (props: {onSelect: Props['onEmojiSelect']}) => {
  const searchedValue = useRecoilValue(searchedAtom).toLowerCase();
  const selectedCategoryHeader = useRecoilValue(contentHeaderSyncAtom);
  const toEmoji = (d: string) =>
    String.fromCodePoint(...d.split('-').map(a => Number(`0x${a}`)));

  const renderItem = useCallback(({item}: {item: EmojiType}) => {
    const emoji = toEmoji(item.unified);
    return (
      <Text onPress={() => props.onSelect(emoji)} style={styles.emojiText}>
        {emoji}
      </Text>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredEmoji = useMemo(
    () =>
      emojis.filter(
        a =>
          a.category ===
            Categories[selectedCategoryHeader as keyof typeof Categories]
              .name &&
          (!searchedValue ||
            a.short_names.findIndex(shortName =>
              shortName.includes(searchedValue.toLowerCase()),
            ) > -1 ||
            a.name.includes(searchedValue.toLowerCase())),
      ),
    [selectedCategoryHeader, searchedValue],
  );

  return (
    <FlatList
      data={filteredEmoji}
      keyExtractor={i => i.unified}
      contentContainerStyle={{
        gap: SPACING.md,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      fadingEdgeLength={50}
      numColumns={NO_OF_COLUMNS}
      renderItem={renderItem}
      style={{marginTop: SPACING.big, flex: 1}}
    />
  );
};

type Props = {
  onClose: () => void;
  onEmojiSelect: (s: string) => void;
};
export default (props: Props) => {
  const fullScreenRef = useRef<UtilTypes.TFullScreenModalRef>(null);
  const setSearchedValueAtom = useSetRecoilState(searchedAtom);
  const resetSearchValue = useResetRecoilState(searchedAtom);
  const resetCategoryType = useResetRecoilState(contentHeaderSyncAtom);
  useEffect(() => {
    return () => {
      resetSearchValue();
      resetCategoryType();
    };
  }, [resetSearchValue, resetCategoryType]);

  const _onSelect = (e: string) => {
    props.onEmojiSelect(e);
    fullScreenRef.current?.close(props.onClose);
  };
  return (
    <Portal>
      <FullScreenModal
        ref={fullScreenRef}
        onModalClose={props.onClose}
        title="Choose Emoji">
        <Screen paddingBottom={0}>
          <Header />
          <SearchBar onValueChange={setSearchedValueAtom} />
          <Content onSelect={_onSelect} />
        </Screen>
      </FullScreenModal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  emojiText: {
    height: _emojiSize,
    width: _emojiSize,
    padding: SPACING.sm,
    fontSize: 30,
  },
});
