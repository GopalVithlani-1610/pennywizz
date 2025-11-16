import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {NavigationTypes} from '@/src/types';
import {Text, TransactionCard} from '@/app/components';
import {COLORS, SPACING} from '@/src/app/theme';
import {
  PayeeEntity,
  TransactionCategoriesLinkEntity,
} from '@/src/types/domainTypes';
import {payeeDatabaseInstance} from '@/src/database';
import CommonStyles from '@/src/app/styles';

type RenderFlatlistWithDataProps = {
  data: TransactionCategoriesLinkEntity[];
  navigation: StackNavigationProp<
    NavigationTypes.TDetailStackScreen & NavigationTypes.RootStack,
    'CategoryDetail'
  >;
  currency: string;
};
const RenderFlatlistWithData = ({
  data,
  navigation,
}: RenderFlatlistWithDataProps) => {
  const [payeeList, setPayeeList] = useState<PayeeEntity[]>([]);
  useEffect(() => {
    (async () => setPayeeList(await payeeDatabaseInstance().getAllPayee()))();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = ({item}: {item: TransactionCategoriesLinkEntity}) => {
    const {amount, category, id, transactionDate, account, notes, payee} = item;
    const payeeEntity = payee ? payeeList.find(p => p.id === payee) : undefined;
    return (
      <TransactionCard
        onPress={() =>
          navigation.navigate('TransactionEditor', {
            amount,
            category: category.id,
            id,
            transactionDate,
            account,
            notes,
            payee,
          })
        }
        showCategory={false}
        transaction={{...item, payee: payeeEntity}}
      />
    );
  };
  return (
    <FlatList
      keyExtractor={item => item.id}
      style={styles.flex}
      data={data}
      contentContainerStyle={{
        gap: SPACING.md,
        marginHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        paddingBottom: SPACING.big,
      }}
      ListEmptyComponent={
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={{textAlign: 'center', fontSize: 12}}>
            You don't have any transaction for this category
          </Text>
        </View>
      }
      ItemSeparatorComponent={
        <View
          style={{
            height: StyleSheet.hairlineWidth,
            backgroundColor: COLORS.lightGray,
          }}
        />
      }
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

export default RenderFlatlistWithData;
