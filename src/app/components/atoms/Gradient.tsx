import React, {PropsWithChildren} from 'react';
import {StyleSheet, View} from 'react-native';
import {Defs, LinearGradient, Rect, Stop, Svg} from 'react-native-svg';

type Props = PropsWithChildren & {
  fromColor: string;
  toColor: string;
};
export default (props: Props) => {
  return (
    <View
      style={{
        flex: 1,
        // borderBottomRightRadius: 40,
        // overflow: 'hidden',
        // borderBottomLeftRadius: 40,
      }}>
      <Svg style={StyleSheet.absoluteFillObject}>
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0" stopColor={props.fromColor} />
            <Stop offset="0.5" stopColor={'#F1B867'} />
            <Stop offset="1" stopColor={props.toColor} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#grad)" />
      </Svg>
      {props.children}
    </View>
  );
};
