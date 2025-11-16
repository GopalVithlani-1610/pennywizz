import React from 'react';
import {StyleSheet} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {DataSection, MoreOptions} from './components';
import {NavigationTypes} from '@/src/types';
import {
  Header,
  PressableIconButton,
  Screen,
  CaptionText,
} from '@/app/components';
import {COLORS} from '@/app/theme';
import {useSharedValue} from 'react-native-reanimated';

export type SpendingScreenNavigationProps = StackScreenProps<
  NavigationTypes.TDetailStackScreen,
  'Spendings$$'
>;

export default (props: SpendingScreenNavigationProps) => {
  const scrollSharedValue = useSharedValue(0);
  return (
    <Screen paddingBottom={0}>
      <Header
        headerTitle="Spendings"
        headerRight={
          <PressableIconButton
            iconName="grid"
            // style={styles.reportContainer}
            iconStyle={{color: COLORS.greenReport, size: 30}}
            onPress={() => props.navigation.navigate('Report')}
          />
        }
      />
      <CaptionText fontSize={10}>
        Tip: Long press on the category item for more options
      </CaptionText>

      <DataSection scrollSharedValue={scrollSharedValue} />
      <MoreOptions />
    </Screen>
  );
};

const styles = StyleSheet.create({
  reportContainer: {
    backgroundColor: COLORS.greenReport,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 100,
  },
});
