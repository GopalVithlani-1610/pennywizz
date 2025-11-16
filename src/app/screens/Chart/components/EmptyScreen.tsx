import * as React from 'react';
import {Dimensions, Image, StyleSheet, View} from 'react-native';
import {DashedButton, Screen, Text} from '@/app/components';
import {BORDER_RADIUS, COLORS, SPACING} from '@/app/theme';
import {Images} from '@/app/assets';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {NavigationTypes} from '@/src/types';
import CommonStyles from '@/src/app/styles';

const {width} = Dimensions.get('window');
const SIZE = width * 0.7;
const EmptyScreen = () => {
  const navigation =
    useNavigation<NavigationProp<NavigationTypes.RootStack, '__TABS__'>>();
  return (
    <Screen>
      <View style={CommonStyles.center}>
        <Image
          borderRadius={BORDER_RADIUS.md}
          source={Images.emptyIconPath()}
          style={styles.image}
        />
        <Text textType="subheading" style={styles.text}>
          Create transaction to show charts...
        </Text>
        <DashedButton
          text="Create a transaction"
          onPress={() => navigation.navigate('TransactionEditor')}
        />
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  image: {
    width: SIZE,
    height: SIZE,
  },
  text: {
    color: COLORS.subHeadingText,
    marginTop: 20,
    fontSize: 18,
    marginBottom: SPACING.big,
  },
});
export default EmptyScreen;
