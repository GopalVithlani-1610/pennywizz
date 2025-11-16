import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

type Props = {
  get: string;
  set: () => void;
};

const Notes = () => {
  return (
    <View>
      <Text>Notes</Text>
    </View>
  );
};

export default () => {
  return (
    <View>
      <Text>Common</Text>
    </View>
  );
};

const styles = StyleSheet.create({});
