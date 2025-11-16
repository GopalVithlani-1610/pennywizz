import React from 'react';
import {StyleSheet} from 'react-native';
import {Pressable, Text} from '@/app/components';
import {BORDER_RADIUS, COLORS, SPACING} from '@/app/theme';
import BhIcon from '@/src/app/assets/icons';
import {useNavigation} from '@react-navigation/native';
import {NavigationTypes} from '@/src/types';
import {StackNavigationProp} from '@react-navigation/stack';

export default () => {
  const navigation =
    useNavigation<StackNavigationProp<NavigationTypes.RootStack>>();
  return (
    <Pressable
      onPress={() => {
        navigation.navigate('TransactionEditor');
      }}
      style={styles.inputStyle}>
      <Text style={{color: COLORS.darkPrimary}}>Create transaction</Text>
      <BhIcon name="circleWithPlus" size={20} color={COLORS.darkPrimary} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    // marginLeft: SPACING.md,
    borderWidth: 0.5,
    borderColor: COLORS.lightPrimary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm + 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderBottomWidth: 3,
    gap: SPACING.sm,
    position: 'absolute',
    bottom: SPACING.sm,
    elevation: 3,
    shadowColor: COLORS.secondry,
    zIndex: 20000,
    flex: 1,
    right: SPACING.sm,
  },
});
