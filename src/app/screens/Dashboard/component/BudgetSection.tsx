import React, {ReactElement} from 'react';
import {View, StyleSheet, ViewStyle, TextStyle, Pressable} from 'react-native';
import {useRecoilValue} from 'recoil';
import {Icons} from '@/app/helper';
import Utils from '@/app/utils';
import {BudgetState} from '@/app/state';
import {Text} from '@/app/components';
import {COLORS} from '@/app/theme';

type Props = {
  text: string;
  background: string;
  amount: string | number;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: ReactElement;
  onPress?: () => void;
};

const Section = ({
  text,
  background,
  amount,
  style,
  children,
  onPress,
  textStyle,
}: Props) => {
  return (
    <>
      <Pressable
        onPress={typeof onPress === 'function' ? onPress : () => {}}
        style={[
          {backgroundColor: background},
          styles.sectionContainer,
          style!,
        ]}>
        <Text textType="normal" style={styles.commonTextStyle}>
          {text}
        </Text>
        <View style={styles.itemContainer}>
          <Text
            textType="subheading"
            style={[styles.commonTextStyle, textStyle ? textStyle : {}]}>
            {amount}
          </Text>
          {typeof children !== 'undefined' ? children : null}
        </View>
      </Pressable>
    </>
  );
};

interface BudgetSectionProps {
  toggleBottomSheet: () => void;
}
export default (props: BudgetSectionProps) => {
  const currentBudgetAmount = useRecoilValue(
    BudgetState.currentMonthBudgetAtom,
  );
  return (
    <View style={styles.container}>
      <Section
        onPress={props.toggleBottomSheet}
        text="budget"
        background={'#FFFFFF'}
        textStyle={{
          color: COLORS.black,
        }}
        amount={
          currentBudgetAmount === -1
            ? 'Not set'
            : Utils.formatIntoCurrency(currentBudgetAmount)
        }>
        <View style={styles.iconContainer}>
          <Icons.AntDesign name="edit" color={COLORS.primary} size={16} />
        </View>
      </Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    justifyContent: 'center',
  },
  sectionContainer: {
    padding: 8,
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 7,
    flex: 0.8,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    // height: 50,
  },
  commonTextStyle: {
    color: COLORS.black,
    fontWeight: '500',
    textTransform: 'capitalize',
    fontSize: 18,
  },
  iconContainer: {
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 3,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
