import React from 'react';
import {View, StyleSheet} from 'react-native';
import {COLORS, SPACING} from '@/app/theme';
import {Pressable, Text} from '../atoms';
import {CategoryEntity} from '@/src/types/domainTypes';
import CommonStyles from '@/app/styles';

const Item = ({item, onPress}: {item: CategoryEntity; onPress: () => void}) => {
  return (
    <Pressable
      animated={false}
      ripple={CommonStyles.btnRipple}
      onPress={onPress}
      style={styles.itemContainer}>
      <Text>{item.emoji}</Text>
      <Text textType="normal" style={styles.text}>
        {item.name}
      </Text>
    </Pressable>
  );
};

interface CategoriesDisplayProps {
  categories: CategoryEntity[];
  onItemPress: (category: CategoryEntity) => void;
  title: string;
}

const CategoriesDisplay = (props: CategoriesDisplayProps) => {
  if (props.categories.length === 0) {
    return null;
  }
  return (
    <>
      <Text style={styles.headerTxt} textType="normal">
        {props.title}
      </Text>
      <View
        style={{
          borderWidth: StyleSheet.hairlineWidth,
          borderColor: COLORS.lightGray,
          padding: SPACING.sm,
          marginVertical: SPACING.md,
        }}>
        {props.categories.map(category => {
          return (
            <View key={category.id}>
              <Item
                onPress={() => props.onItemPress(category)}
                key={category.id}
                item={category}
              />
              <View style={[CommonStyles.separator, styles.separator]} />
            </View>
          );
        })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: COLORS.black,
    flex: 1,
    marginLeft: SPACING.sm,
  },
  itemContainer: {
    padding: SPACING.custom(1.5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTxt: {
    color: COLORS.secondry,
    fontSize: 14,
    marginTop: SPACING.big,
  },
  separator: {
    // height: 1,
    // backgroundColor: COLORS.lightGray,
    marginHorizontal: SPACING.md,
  },
});

export default CategoriesDisplay;
