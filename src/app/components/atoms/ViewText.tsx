import React from 'react';
import {View, ViewStyle, TextStyle} from 'react-native';
import {UtilTypes} from '../../../types';
import Text from './Text';

type Props = {
  text: string | number;
  viewStyle?: ViewStyle;
  textStyle?: TextStyle | TextStyle[];
  textType?: UtilTypes.TTextType;
};
const ViewText = (props: Props) => {
  return (
    <View style={props.viewStyle}>
      <Text textType={props.textType || 'normal'} style={props.textStyle}>
        {props.text}
      </Text>
    </View>
  );
};

export default ViewText;
