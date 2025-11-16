import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {ScrollView} from 'react-native';
import {useRecoilValue} from 'recoil';
import {NavigationTypes} from '@/src/types';
import {CategoriesToDisplay, Pressable, Screen, Text} from '@/app/components';
import {categoriesState} from '@/app/state';
import {COLORS} from '@/app/theme';
import {CategoryEntity} from '@/src/types/domainTypes';
import CommonStyles from '@/src/app/styles';

interface Props {
  navigation: StackNavigationProp<
    NavigationTypes.TSettingStackScreen,
    'Settings$$'
  >;
  closeModal: () => void;
}
export default ({navigation, closeModal}: Props) => {
  const categories = useRecoilValue(categoriesState);
  const navigateToEditCategoy = (item: CategoryEntity) => {
    if (!item.id) return;
    closeModal();
    navigation.navigate('Edit', {
      category: item,
      comingFrom: 'Category',
    });
  };

  const goToNewCategory = () => {
    closeModal();
    navigation.navigate('Edit', {
      comingFrom: 'Category',
      type: 'New',
    });
  };

  return (
    <Screen>
      <ScrollView>
        <Pressable onPress={goToNewCategory} style={CommonStyles.btnStyle}>
          <Text style={{color: COLORS.white}}>Add new category</Text>
        </Pressable>
        <CategoriesToDisplay
          title="Expense Categories"
          onItemPress={category => navigateToEditCategoy(category)}
          categories={categories.filter(a => a.type === 'expense')}
        />
        <CategoriesToDisplay
          title="Income Categories"
          onItemPress={category => navigateToEditCategoy(category)}
          categories={categories.filter(a => a.type === 'income')}
        />
      </ScrollView>
    </Screen>
  );
};
