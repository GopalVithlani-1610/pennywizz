import {StackNavigationProp} from '@react-navigation/stack';
import React, {useEffect} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {CurrencyOperations} from '@/src/database';
import {NavigationTypes} from '@/src/types';
import {Loader, Pressable, Screen, Text} from '@/app/components';
import {COLORS, SPACING} from '@/app/theme';
import CommonStyles from '@/src/app/styles';

type Props = {
  data: any[];
  onItemSelect: (name: string, symbol: string) => void;
  navigation: StackNavigationProp<
    NavigationTypes.TSettingStackScreen,
    'Settings$$'
  >;
};

export default (props: Props) => {
  const [loading, setLoading] = React.useState(true);
  const [selectedCurrency, setSelectedCurrency] = React.useState<
    | {
        symbol?: string;
        name?: string;
      }
    | undefined
  >(undefined);
  const init = async () => {
    const currency = await CurrencyOperations.getCurrency();
    setSelectedCurrency({name: currency.name, symbol: currency.symbol});
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  const _onItemSelect = async (name: string, symbol: string) => {
    props.onItemSelect(name, symbol);
    setSelectedCurrency({name, symbol});
  };

  const renderItem = ({item}: {item: any}) => {
    const isSelected =
      item.symbol === selectedCurrency?.symbol &&
      item.name === selectedCurrency?.name;
    return (
      <Pressable
        animated={false}
        ripple={CommonStyles.btnRipple}
        onPress={() => _onItemSelect(item.name, item.symbol)}
        style={styles.itemContainer}>
        <Text textType="normal" style={styles.text}>
          {item.name}
        </Text>
        <Text
          textType="subheading"
          style={[
            styles.symbol,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              color: isSelected ? COLORS.primary : 'black',
            },
          ]}>
          {item.symbol}
        </Text>
      </Pressable>
    );
  };
  if (loading) {
    return <Loader show={loading} text="Loading Currencies..." />;
  }
  return (
    <Screen>
      <FlatList
        style={{marginHorizontal: SPACING.md}}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        data={props.data}
        renderItem={renderItem}
      />
    </Screen>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#000',
  },
  itemContainer: {
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  symbol: {
    fontSize: 18,
    // fontWeight: 'bold',
    color: '#000',
  },
});
