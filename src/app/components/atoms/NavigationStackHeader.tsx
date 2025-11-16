import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import BhIcon from '../../assets';
import CommonStyles from '../../styles';

export default () => {
  return (
    <View style={[CommonStyles.displayRow, styles.container]}>
      <BhIcon name="chevron-down" />
      <Text>NavigationStackHeader</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F2F2F2',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
